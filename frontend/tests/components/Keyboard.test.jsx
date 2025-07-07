import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, vi } from "vitest";
import * as usersService from "../../src/services/users.js";
import * as stationsService from "../../src/services/stations.js";
import { Keyboard } from "../../src/components/Keyboard/Keyboard.jsx";
import App from "../../src/App.jsx";
import { DateTime } from "luxon";
import { useState } from "react";

vi.mock("../../src/services/users.js");
vi.mock("../../src/services/stations.js");
vi.mock("../../src/utils/graphUtils.js", () => ({
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

const mockUser = {
  username: "testUser",
  game: {
    guesses: [
      {
        name: "Universidad de Chile",
        lines: ["1", "3"],
        coordinates: [101, 101],
      },
    ],
    guessedLines: ["1", "3"],
    guessedStationNames: ["universidaddechile"],
  },
  lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
};

const Wrapper = () => {
  const [search, setSearch] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [guessedLines, setGuessedLines] = useState(new Set());
  const [guessedStationNames, setGuessedStationNames] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);

  return (
    <>
      <div data-testid="search-display">{search}</div>
      <div data-testid="filtered-stations">
        {filteredStations.map((station) => (
          <div key={station.name}>{station.name}</div>
        ))}
      </div>
      <Keyboard
        search={search}
        setSearch={setSearch}
        filteredStations={filteredStations}
        setFilteredStations={setFilteredStations}
        setGuesses={setGuesses}
        setGuessedLines={setGuessedLines}
        setGuessedStationNames={setGuessedStationNames}
        normalize={(str) =>
          str
            .normalize("NFD")
            .replace(/(?<=[aeiouAEIOU])\u0301/g, "")
            .normalize("NFC")
            .toLowerCase()
            .replace(/\s+/g, "")
        }
        showMenu={false}
        today={DateTime.now().setZone("America/Santiago").startOf("day")}
        user={mockUser}
        guessedStationNames={[]}
      />
    </>
  );
};
describe("Keyboard component", () => {
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
                  3 station 3
                  4 station 4
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
                  coordinates: [100, 100],
                },
                {
                  name: "Universidad de Chile",
                  lines: ["1", "3"],
                  coordinates: [101, 101],
                },
                {
                  name: "station 3",
                  lines: ["1", "3"],
                  coordinates: [106, 109],
                },
                {
                  name: "station 4",
                  lines: ["4", "6"],
                  coordinates: [102, 103],
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
        coordinates: [100, 100],
      },
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
        {
          name: "station 3",
          lines: ["1", "3"],
          coordinates: [106, 109],
        },
        {
          name: "station 4",
          lines: ["4", "6"],
          coordinates: [102, 103],
        },
      ],
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
  it("Is present when game hasn't ended yet", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [
          {
            name: "Universidad de Chile",
            lines: ["1", "3"],
            coordinates: [101, 101],
          },
        ],
        guessedLines: ["1", "3"],
        guessedStationNames: ["universidaddechile"],
      },
      lastPlayed: DateTime.now().minus({ days: 1 }).toISO(),
    });
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
  });
  it("Contains keys that add to search when clicked", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await user.click(screen.getByText("A"));
    await user.click(screen.getByText("B"));
    await user.click(screen.getByText("C"));
    await user.click(screen.getByText("D"));
    await user.click(screen.getByText("E"));
    await user.click(screen.getByText("F"));
    await user.click(screen.getByText("G"));
    await user.click(screen.getByText("H"));
    await user.click(screen.getByText("I"));
    await user.click(screen.getByText("J"));
    await user.click(screen.getByText("K"));
    await user.click(screen.getByText("L"));
    await user.click(screen.getByText("M"));
    await user.click(screen.getByText("N"));
    await user.click(screen.getByText("O"));
    await user.click(screen.getByText("P"));
    await user.click(screen.getByText("Q"));
    await user.click(screen.getByText("R"));
    await user.click(screen.getByText("S"));
    await user.click(screen.getByText("T"));
    await user.click(screen.getByText("U"));
    await user.click(screen.getByText("V"));
    await user.click(screen.getByText("W"));
    await user.click(screen.getByText("X"));
    await user.click(screen.getByText("Y"));
    await user.click(screen.getByText("Z"));
    await user.click(screen.getByText("Ñ"));
    await waitFor(() => {
      expect(screen.getByTestId("search-display")).toHaveTextContent(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZÑ"
      );
    });
  });
  it("Contains backspace key that removes a single character from search when clicked", async () => {
    const user = userEvent.setup();
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
      expect(screen.getByTestId("delete-symbol")).toBeInTheDocument();
    });
    await user.click(screen.getByText("U"));
    await user.click(screen.getByText("N"));
    await waitFor(() => {
      expect(screen.getByTestId("highlight")).toHaveTextContent("UN");
    });
    await user.click(screen.getByTestId("delete-symbol"));
    await waitFor(() => {
      expect(screen.getByTestId("highlight")).toHaveTextContent("U");
    });
  });
  it("Contains enter key that makes a guess when one station is in the container", async () => {
    const user = userEvent.setup();
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
      expect(screen.getByText("INTRODUCIR")).toBeInTheDocument();
    });
    await user.click(screen.getByText("U"));
    await user.click(screen.getByText("N"));
    await waitFor(() => {
      const line1Circle = screen.getByAltText("Línea 1");
      const line3Circle = screen.getByAltText("Línea 3");
      expect(line1Circle).toBeInTheDocument();
      expect(line3Circle).toBeInTheDocument();
    });
    await user.click(screen.getByText("INTRODUCIR"));
    await waitFor(() => {
      const guessesMade = screen.getAllByTestId("guess-card-guessed");
      const remainingGuesses = screen.getAllByTestId("guess-card-not-guessed");
      expect(guessesMade.length).toBe(2);
      expect(remainingGuesses.length).toBe(5);
    });
  });
  it("Contains enter key that doesn't make a guess when more than one station is in the container", async () => {
    const user = userEvent.setup();
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
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
    await user.click(screen.getByText("S"));
    await waitFor(() => {
      const filteredStations = screen.getAllByTestId("station");
      expect(filteredStations.length).toBe(2);
    });
    await user.click(screen.getByText("INTRODUCIR"));
    await waitFor(() => {
      const guessesMade = screen.getAllByTestId("guess-card-guessed");
      const remainingGuesses = screen.getAllByTestId("guess-card-not-guessed");
      expect(guessesMade.length).toBe(1);
      expect(remainingGuesses.length).toBe(6);
    });
  });
  it("Doesn't appear when game has ended", async () => {
    usersService.getUser.mockResolvedValueOnce({
      username: "testUser",
      game: {
        guesses: [],
        guessedLines: [],
        guessedStationNames: [],
      },
      lastPlayed: DateTime.now().setZone("America/Santiago").startOf("day"),
    });
    render(<App />);
    const keyboard = screen.queryByTestId("keyboard-container");
    await waitFor(() => {
      expect(keyboard).not.toBeInTheDocument();
    });
  });
  it("Contains keys that grey out if no letters after initial search appear in any matching station names", async () => {
    const user = userEvent.setup();
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
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
    await user.click(screen.getByText("U"));
    const notNextLetters = screen.getAllByTestId("key-not-next");
    expect(notNextLetters.length).toBe(26);
    expect(screen.getAllByTestId("key").length).toBe(1);
  });
  it("Contains keys that appear blue if letters after initial search appear in any matching station names", async () => {
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
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
    const nextLetters = screen.getAllByTestId("key");
    expect(nextLetters.length).toBe(27);
  });
  it("Contains enter and backspace keys that are greyed out if no search has been made", async () => {
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
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
    const nonLetterKeys = screen.getAllByTestId("non-letter-button");
    expect(nonLetterKeys.length).toBe(2);
  });
  it("Contains enter and backspace keys that are blue if search has been made and only one station matches", async () => {
    const user = userEvent.setup();
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
      expect(screen.getByTestId("keyboard-container")).toBeInTheDocument();
    });
    await user.click(screen.getByText("U"));
    await user.click(screen.getByText("N"));
    await waitFor(() => {
      const nonLetterKeys = screen.getAllByTestId(
        "non-letter-button-clickable"
      );
      expect(nonLetterKeys.length).toBe(2);
    });
  });
});
