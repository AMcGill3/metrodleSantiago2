import { render, screen, waitFor } from "@testing-library/react";
import * as stationsService from "../../src/services/stations.js";
import * as usersService from "../../src/services/users.js";
import App from "../../src/App.jsx";
import { beforeEach, describe, vi } from "vitest";
import { DateTime } from "luxon";

vi.mock("../../src/services/stations.js");
vi.mock("../../src/services/users.js");
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

describe("Stats container", () => {
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
                  #
                  1 2
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
    stationsService.getAllStations.mockResolvedValue({
      stations: [
        {
          name: "Plaza de Armas",
          lines: ["3", "5"],
          coordinates: [100, 100],
        },
        {
          name: "Universidad de Chile",
          lines: ["1", "3"],
          coordinates: [101, 101],
        },
      ],
    });
    window.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 0);
      }
    };
  });
  it("Contains puzzle number", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });
    render(<App />);
    await waitFor(() => {
      const puzzleNumber = screen.getAllByTestId("puzzle-number");
      expect(puzzleNumber.length).toBe(1);
      expect(puzzleNumber[0]).toHaveTextContent("Metrodle Santiago # 1");
    });
  });
  it("Contains headers of relevant stats", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });
    render(<App />);
    await waitFor(() => {
      const figureItems = screen.getAllByTestId("figure-item");
      expect(figureItems.length).toBe(5);
      expect(figureItems[0]).toHaveTextContent("Jugado");
      expect(figureItems[1]).toHaveTextContent("Ganas");
      expect(figureItems[2]).toHaveTextContent("Porcentaje Ganado");
      expect(figureItems[3]).toHaveTextContent("Racha");
      expect(figureItems[4]).toHaveTextContent("Racha Máxima");
    });
  });
  it("Contains stats with 0s for first time user", async () => {
    const mockUser = {
      username: "newUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      streak: 0,
      gamesPlayed: 0,
      maxStreak: 0,
      winsInXGuesses: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
      lastPlayed: null,
    };
    usersService.getUser.mockResolvedValueOnce(mockUser);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("played")).toBeInTheDocument();
    });

    const played = screen.getByTestId("played");
    const wins = screen.getByTestId("wins");
    const percentWon = screen.getByTestId("percent-won");
    const streak = screen.getByTestId("streak");
    const maxStreak = screen.getByTestId("max-streak");

    await waitFor(() => {
      expect(played).toHaveTextContent("0");
      expect(wins).toHaveTextContent("0");
      expect(percentWon).toHaveTextContent("0%");
      expect(streak).toHaveTextContent("0");
      expect(maxStreak).toHaveTextContent("0");
    });
  });
  it("Contains correctly calculated win rate", async () => {
    const mockUser = {
      username: "newUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      streak: 0,
      gamesPlayed: 5,
      maxStreak: 0,
      winsInXGuesses: {
        1: 0,
        2: 0,
        3: 1,
        4: 0,
        5: 2,
        6: 0,
      },
      lastPlayed: null,
    };
    usersService.getUser.mockResolvedValueOnce(mockUser);
    render(<App />);
    await waitFor(() => {
      const percentWon = screen.getByTestId("percent-won");
      expect(percentWon).toBeInTheDocument();
      expect(percentWon).toHaveTextContent("60%");
    });
  });
});
