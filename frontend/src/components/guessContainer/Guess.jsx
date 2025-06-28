import "./Guess.css";
import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import arrowMap from "../../utils/loadArrowSVGs";

export const Guess = ({
  guessed,
  guess,
  targetStation,
  guessedLines,
  stopsFromTarget,
  theme,
  howToPlay,
}) => {
  const directions = [
    "up",
    "northEast",
    "east",
    "southEast",
    "down",
    "southWest",
    "west",
    "northWest",
  ];

  const arrows = Object.fromEntries(
    directions.map((dir) => [
      dir,
      arrowMap[theme === "dark" ? `${dir}Dark` : dir],
    ])
  );

  const up = arrows.up;
  const northEast = arrows.northEast;
  const east = arrows.east;
  const southEast = arrows.southEast;
  const down = arrows.down;
  const southWest = arrows.southWest;
  const west = arrows.west;
  const northWest = arrows.northWest;

  const calculateDirection = (guessCoordinates) => {
    return [
      targetStation.coordinates[0] - guessCoordinates[0],
      targetStation.coordinates[1] - guessCoordinates[1],
    ];
  };

  const chooseArrow = (dir) => {
    const x = dir[0];
    const y = dir[1];

    if (x > 0 && y >= 0) {
      if (y <= 25) {
        return east;
      } else if (x <= 25) {
        return down;
      } else {
        return southEast;
      }
    } else if (x > 0 && y <= 0) {
      if (y >= -25) {
        return east;
      } else if (x <= 25) {
        return up;
      } else {
        return northEast;
      }
    } else if (x < 0 && y < 0) {
      if (y >= -25) {
        return west;
      } else if (x >= -25) {
        return up;
      } else {
        return northWest;
      }
    } else if (x === 0 && y < 0) {
      return up;
    } else if (x === 0 && y > 0) {
      return down;
    } else if (x < 0 && y > 0) {
      if (y <= 25) {
        return west;
      } else if (x >= -25) {
        return down;
      } else {
        return southWest;
      }
    } else if (x === 0 && y === 0) {
      return "correct";
    }

    return southWest;
  };

  const direction =
    guess && guess.coordinates && targetStation && targetStation.coordinates
      ? calculateDirection(guess.coordinates)
      : null;
  const arrow = direction ? chooseArrow(direction) : null;

  const stopsAway =
    guess && guess.name && targetStation && targetStation.name
      ? stopsFromTarget(guess.name)
      : null;

  const name = guess && guess.name ? guess.name : null;
  const lines = guess && guess.lines ? guess.lines : null;

  if (name && name === targetStation?.name) {
    return (
      <div className="correct-guess" data-testid="correct-guess">
        <div
          className="station-name-correct"
          data-testid="station-name-correct"
        >
          {name}
        </div>
        <h6 className="correct-guess-extra-message">
          Deje bajar antes de subir
        </h6>
      </div>
    );
  }

  const translateAlt = (dir) => {
    if (!dir) return "dirección";
    const directionMap = {
      up: "norte",
      northEast: "noreste",
      east: "este",
      southEast: "sureste",
      down: "sur",
      southWest: "suroeste",
      west: "oeste",
      northWest: "noroeste",
    };

    const arrowImg = chooseArrow(dir);
    const fileName = arrowImg?.split("/")?.pop()?.replace(".svg", "");

    const normalized = fileName?.replace("Dark", "");

    return directionMap[normalized] || "dirección";
  };

  return (
    <div
      className={`guess-card ${guessed ? "guessed" : "not-guessed"}`}
      data-testid={`guess-card-${guessed ? "guessed" : "not-guessed"}`}
    >
      <div className="left">
        {name && (
          <div className="guess-station-name" data-testid="guess-station-name">
            {name}
          </div>
        )}
        {lines && (
          <div className="lines">
            {lines.map((line) => {
              const circle =
                targetStation &&
                guessedLines?.has(line) &&
                !targetStation.lines.includes(line)
                  ? wrongCircleMap[`circle${line}Wrong`]
                  : circleMap[`circle${line}`];
              return (
                <img
                  className="circle"
                  data-testid="circle"
                  key={line}
                  src={circle}
                  alt={`Línea ${line} ${
                    !targetStation?.lines.includes(line)
                      ? "incorecta "
                      : "corecta"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {guessed && stopsAway !== 0 && (
        <div className="right">
          <div className="stops-away" data-testid="stops-away">
            {howToPlay ? "1" : stopsAway}{" "}
            {howToPlay ? "parada" : stopsAway === 1 ? "parada" : "paradas"}
          </div>
          {arrow !== "correct" && (
            <div className="direction">
              <img
                data-testid="direction-arrow"
                src={arrow}
                alt={translateAlt(direction)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
