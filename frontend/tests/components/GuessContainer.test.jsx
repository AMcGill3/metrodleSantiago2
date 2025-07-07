import { render, screen, waitFor } from "@testing-library/react";
import * as stationsService from "../../src/services/stations.js";
import * as usersService from "../../src/services/users.js";
import App from "../../src/App.jsx";
import { GuessContainer } from "../../src/components/guessContainer/GuessContainer.jsx";
import { beforeEach, describe, vi } from "vitest";
import { bfsDistance } from "../../src/utils/graphUtils.js";
import { DateTime } from "luxon";

vi.mock("../../src/services/users.js");
vi.mock("../../src/services/stations.js");
vi.mock("../../src/utils/graphUtils.js", () => ({
  loadGraphFromTGF: vi.fn(() =>
    Promise.resolve({
      nodes: {
        1: "Plaza de Armas",
        2: "Universidad de Chile",
        3: "Santa Ana",
        4: "La Moneda",
        5: "Los Héroes",
        6: "Santa Lucía",
        7: "Bellas Artes",
      },
      edges: [["1", "2", "3", "4", "5", "6", "7"]],
    })
  ),
  buildGraph: vi.fn(() => ({
    1: [2, 3, 7],
    2: [1, 4, 6],
    3: [1, 5],
    4: [2, 5],
    5: [3, 4],
    6: [2],
    7: [1],
  })),

  bfsDistance: vi.fn(),
}));

describe("Guess container", () => {
  let targetStation;
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.endsWith(".tgf")) {
          return Promise.resolve({
            text: () =>
              Promise.resolve(`
                  1 Plaza de Armas
                  2 Universidad de Chile
                  3 Santa Ana
                  4 La Moneda
                  5 Los Héroes
                  6 Santa Lucía
                  7 Bellas Artes
                  #
                  1 2
                  1 3
                  2 4
                  4 5
                  3 5
                  2 6
                  1 7
                `),
          });
        }

        if (url.endsWith("stations.json")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve([
                {
                  name: "Plaza de Armas",
                  lines: ["3", "5"],
                  coordinates: [839.5, 456.5],
                },
                {
                  name: "Universidad de Chile",
                  lines: ["1", "3"],
                  coordinates: [839.5, 548],
                },
                {
                  name: "Santa Ana",
                  lines: ["2", "5"],
                  coordinates: [758, 456],
                },
                {
                  name: "La Moneda",
                  lines: ["1"],
                  coordinates: [795, 547],
                },
                {
                  name: "Los Héroes",
                  lines: ["1", "2"],
                  coordinates: [757, 547],
                },
                {
                  name: "Santa Lucía",
                  lines: ["1"],
                  coordinates: [905, 547],
                },
                {
                  name: "Bellas Artes",
                  lines: ["5"],
                  coordinates: [928, 456.5],
                },
              ]),
          });
        }

        return Promise.reject(new Error(`Unhandled fetch URL: ${url}`));
      })
    );
    (targetStation = {
      name: "Plaza de Armas",
      lines: ["3", "5"],
      coordinates: [839.5, 456.5],
    }),
      stationsService.getTargetStation.mockResolvedValue({
        station: targetStation,
        number: 1,
      });

    usersService.getUser.mockResolvedValue({
      username: "testUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });

    usersService.createUser.mockResolvedValue("testUser");
    window.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 0);
      }
    };
  });

  it("Contains six blank guesses upon render when no guesses have been made", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("guess-container")).toBeInTheDocument();
      const guesses = screen.getAllByTestId("guess-card-not-guessed");
      expect(guesses.length).toBe(6);
    });
  });
  it("Contains one filled in guess and five blank guesses upon render when one guess is made", async () => {
    const mockGuesses = [
      {
        name: "Universidad de Chile",
        lines: ["1", "3"],
        coordinates: [839.5, 548],
      },
    ];
    render(
      <GuessContainer
        guesses={mockGuesses}
        guessedLines={new Set(["1", "3"])}
        targetStation={targetStation}
        stopsFromTarget={() => 3}
        theme={"light"}
      />
    );
    await waitFor(() => {
      const guesses = screen.getAllByTestId("guess-card-not-guessed");
      const madeGuess = screen.getAllByTestId("guess-card-guessed");
      expect(madeGuess.length).toBe(1);
      expect(guesses.length).toBe(5);
    });
  });
});
