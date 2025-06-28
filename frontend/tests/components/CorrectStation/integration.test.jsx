import { render, screen, waitFor } from "@testing-library/react";
import App from "../../../src/App.jsx";
import * as usersService from "../../../src/services/users.js";
import * as stationsService from "../../../src/services/stations.js";
import { DateTime } from "luxon";
import { vi } from "vitest";

vi.mock("../../../src/services/users.js");
vi.mock("../../../src/services/stations.js");
vi.mock("../../../src/utils/graphUtils.js", () => ({
  loadGraphFromTGF: vi.fn(() =>
    Promise.resolve({
      nodes: { 1: "Plaza de Armas", 2: "Universidad de Chile" },
      edges: [["1", "2"]],
    })
  ),
  buildGraph: vi.fn(() => ({
    1: [2],                             
    2: [1],
  })),
  bfsDistance: vi.fn(() => 0),
}));

describe("correct station pop up integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.endsWith(".tgf")) {
          return Promise.resolve({
            text: () =>
              Promise.resolve(`
              1 Plaza_de_Armas
              2 Universidad_de_Chile
              #
              1 2
            `),
          });
        }

        if (url.endsWith("stations.json")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve([
                { name: "Plaza de Armas", lines: ["3", "5"], coordinates: [100, 100] },
                { name: "Universidad de Chile", lines: ["1", "3"], coordinates: [101, 101] },
                { name: "station 3", lines: ["1", "3"], coordinates: [106, 109] },
                { name: "station 4", lines: ["4", "6"], coordinates: [102, 103] },
                { name: "station 5", lines: ["2", "4A"], coordinates: [111, 110] },
                { name: "station 6", lines: ["2"], coordinates: [113, 1190] },
                { name: "station 7", lines: ["6"], coordinates: [115, 1004] },
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
        coordinates: [100, 100],
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
  });

  it("shows and hides the CorrectStation popup when the user wins", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          {
            name: "Plaza de Armas",
            lines: ["3", "5"],
            coordinates: [100, 100],
          },
        ],
        guessedLines: ["3", "5"],
        guessedStationNames: ["plazadearmas"],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });

    render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    });

    const stationName = await screen.findByRole("heading", { level: 2 });
    expect(stationName).toHaveTextContent("Plaza de Armas");

    const popup = document.querySelector(".correct-guess-container.open");
    expect(popup).toBeInTheDocument();

    await waitFor(() => {
      const closedPopup = document.querySelector(".correct-guess-container.closed");
      expect(closedPopup).toBeInTheDocument();
    }, { timeout: 4500 });
  });

  it("shows and hides the CorrectStation popup when the user loses", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          { name: "Universidad de Chile", lines: ["1", "3"], coordinates: [101, 101] },
          { name: "station 3", lines: ["1", "3"], coordinates: [106, 109] },
          { name: "station 4", lines: ["4", "6"], coordinates: [102, 103] },
          { name: "station 5", lines: ["2", "4A"], coordinates: [111, 110] },
          { name: "station 6", lines: ["2"], coordinates: [113, 1190] },
          { name: "station 7", lines: ["6"], coordinates: [115, 1004] },
        ],
        guessedLines: ["1", "3", "4", "6", "2", "4A"],
        guessedStationNames: [
          "universidaddechile",
          "station3",
          "station4",
          "station5",
          "station6",
          "station7",
        ],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });

    render(<App />);
    await waitFor(() => {
      expect(screen.queryByTestId("loading-screen")).not.toBeInTheDocument();
    });

    const stationName = await screen.findByRole("heading", { level: 2 });
    expect(stationName).toHaveTextContent("Plaza de Armas");

    const popup = document.querySelector(".correct-guess-container.open");
    expect(popup).toBeInTheDocument();

    await waitFor(() => {
      const closedPopup = document.querySelector(".correct-guess-container.closed");
      expect(closedPopup).toBeInTheDocument();
    }, { timeout: 4500 });
  });
});
