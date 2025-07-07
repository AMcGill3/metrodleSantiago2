import { render, screen, waitFor } from "@testing-library/react";
import App from "../../src/App.jsx";
import * as usersService from "../../src/services/users.js";
import * as stationsService from "../../src/services/stations.js";
import { DateTime } from "luxon";
import { vi } from "vitest";

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

  bfsDistance: vi.fn(() => 0),
}));

describe("countdown", () => {
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

    stationsService.getTargetStation.mockResolvedValue({
      station: {
        name: "Plaza de Armas",
        lines: ["3", "5"],
        coordinates: [839.5, 456.5],
      },
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

  it("doesn't appear when game hasn't ended yet", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          {
            name: "La Moneda",
            lines: ["1"],
            coordinates: [795, 547],
          },
        ],
        guessedLines: ["1"],
        guessedStationNames: ["lamoneda"],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });
    render(<App />);

    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
  });

  it("Appears after game ends in a win", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          {
            name: "Plaza de Armas",
            lines: ["3", "5"],
            coordinates: [839.5, 456.5],
          },
        ],
        guessedLines: ["3", "5"],
        guessedStationNames: ["plazadearmas"],
      },
      lastPlayed: DateTime.now().toISO(),
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("countdown")).toBeInTheDocument();
    });
  });

  it("Appears after game ends in a loss", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
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
        ],
        guessedLines: ["1", "3", "2", "5"],
        guessedStationNames: [
          "universidaddechile",
          "santaana",
          "lamoneda",
          "losheroes",
          "santalucia",
        ],
      },
      lastPlayed: DateTime.now().toISO(),
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("countdown")).toBeInTheDocument();
    });
  });

  it("Correctly counts down to midnight Santiago time", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          {
            name: "Plaza de Armas",
            lines: ["3", "5"],
            coordinates: [839.5, 456.5],
          },
        ],
        guessedLines: ["3", "5"],
        guessedStationNames: ["plazadearmas"],
      },
      lastPlayed: DateTime.now().toISO(),
    });
    render(<App />);
    await waitFor(
      () => {
        const timeText = screen.getByTestId("time");
        expect(timeText).toBeTruthy();
        expect(timeText.textContent).toMatch(/^(\d{2}):(\d{2}):(\d{2})$/);
      },
      { timeout: 2000 }
    );
  });
});
