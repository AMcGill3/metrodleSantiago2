import { render, screen, waitFor } from "@testing-library/react";
import * as stationsService from "../../src/services/stations.js";
import { Guess } from "../../src/components/guessContainer/Guess.jsx";
import { beforeEach, describe, vi } from "vitest";
import { bfsDistance } from "../../src/utils/graphUtils.js";

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

describe("Guess card", () => {
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
    targetStation = {
      name: "Plaza de Armas",
      lines: ["3", "5"],
      coordinates: [839.5, 456.5],
    },
      stationsService.getTargetStation.mockResolvedValue({
        station: targetStation,
        number: 1,
      });
  });
  it("Contains name of guessed station", async () => {
    const mockGuess = {
      name: "Los Héroes",
      lines: ["1", "2"],
      coordinates: [757, 547],
    };
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["1", "2"])}
        stopsFromTarget={() => 3}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByTestId("guess-station-name")).toHaveTextContent(
        "Los Héroes"
      );
    });
  });
  it("Contains circles with line if station is on same line as target station", async () => {
    const mockGuess = {
      name: "Bellas Artes",
      lines: ["5"],
      coordinates: [928, 456.5],
    };
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["5"])}
        stopsFromTarget={() => 3}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      const image = screen.getByAltText("Línea 5 corecta");
      expect(image.src).toContain("/src/assets/LineCircles/circle5.svg");
    });
  });
  it("Contains circles with crosses through if station isn't on same line as target station", async () => {
    const mockGuess = {
      name: "Los Héroes",
      lines: ["1", "2"],
      coordinates: [757, 547],
    };
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["1", "2"])}
        stopsFromTarget={() => 3}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      const images = screen.getAllByTestId("circle");
      expect(images[0].src).toContain(
        "/src/assets/LineCirclesWrong/circle1Wrong.svg"
      );
      expect(images[1].src).toContain(
        "/src/assets/LineCirclesWrong/circle2Wrong.svg"
      );
    });
  });
  it("Contains mix of right and wrong line circles if station has a right and wrong line", async () => {
    const mockGuess = {
      name: "Universidad de Chile",
      lines: ["1", "3"],
      coordinates: [839.5, 548],
    };
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["1", "3"])}
        stopsFromTarget={() => 3}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      const images = screen.getAllByTestId("circle");
      expect(images[0].src).toContain(
        "/src/assets/LineCirclesWrong/circle1Wrong.svg"
      );
      expect(images[1].src).toContain("/src/assets/LineCircles/circle3.svg");
    });
  });
  it("Contains correct number of stops away from target station", async () => {
    vi.unmock("../../src/utils/graphUtils.js");

    const mockGuess = {
      name: "Los Héroes",
      lines: ["1", "2"],
      coordinates: [757, 547],
    };
    const graph = {
      1: [2, 3, 7],
      2: [1, 4, 6],
      3: [1, 5],
      4: [2, 5],
      5: [3, 4],
      6: [2],
      7: [1],
    };

    const nameToId = {
      "Plaza de Armas": 1,
      "Universidad de Chile": 2,
      "Santa Ana": 3,
      "La Moneda": 4,
      "Los Héroes": 5,
      "Santa Lucía": 6,
      "Bellas Artes": 7,
    };

    const stopsFromTarget = (stationName) =>
      bfsDistance(graph, nameToId[stationName], nameToId[targetStation.name]);
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["1", "2"])}
        stopsFromTarget={stopsFromTarget}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      const stopsText = screen.getByTestId("stops-away");
      expect(stopsText).toHaveTextContent("2 paradas");
    });
  });
  it("Contains correct arrow based on direction from target station", async () => {
    vi.unmock("../../src/utils/graphUtils.js");

    const mockGuess = {
      name: "Los Héroes",
      lines: ["1", "2"],
      coordinates: [757, 547],
    };
    const graph = {
      1: [2, 3, 7],
      2: [1, 4, 6],
      3: [1, 5],
      4: [2, 5],
      5: [3, 4],
      6: [2],
      7: [1],
    };

    const nameToId = {
      "Plaza de Armas": 1,
      "Universidad de Chile": 2,
      "Santa Ana": 3,
      "La Moneda": 4,
      "Los Héroes": 5,
      "Santa Lucía": 6,
      "Bellas Artes": 7,
    };

    const stopsFromTarget = (stationName) =>
      bfsDistance(graph, nameToId[stationName], nameToId[targetStation.name]);
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["1", "2"])}
        stopsFromTarget={stopsFromTarget}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      const directionArrow = screen.getByTestId("direction-arrow");
      expect(directionArrow.src).toContain(
        "/src/assets/DirectionArrows/northEast.svg"
      );
    });
  });
  it("Says extra text for when correct station is guessed", async () => {
    const mockGuess = {
      name: "Plaza de Armas",
      lines: ["3", "5"],
      coordinates: [839.5, 456.5],
    };
    render(
      <Guess
        guessed={true}
        guess={mockGuess}
        targetStation={targetStation}
        guessedLines={new Set(["3", "5"])}
        stopsFromTarget={() => 0}
        theme={"light"}
        howToPlay={false}
      />
    );
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 6 })).toHaveTextContent(
        "Deje bajar antes de subir"
      );
      expect(screen.getByTestId("station-name-correct")).toHaveTextContent(
        "Plaza de Armas"
      );
    });
  });
});
