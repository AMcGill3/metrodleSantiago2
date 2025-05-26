import "./Guess.css";
import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import arrowMap from "../../utils/loadArrowSVGs";
import { loadGraphFromTGF } from "../../utils/loadGraphFromTGF.js";
import { buildGraph, bfsDistance } from "../../utils/graphUtils.js";
import { useEffect, useState } from "react";
import upArrowDark from "../../assets/DirectionArrows/upDark.svg";
import northEastArrowDark from "../../assets/DirectionArrows/northEastDark.svg";
import eastArrowDark from "../../assets/DirectionArrows/eastDark.svg";
import southEastArrowDark from "../../assets/DirectionArrows/southEastDark.svg";
import downArrowDark from "../../assets/DirectionArrows/downDark.svg";
import southWestArrowDark from "../../assets/DirectionArrows/southWestDark.svg";
import westArrowDark from "../../assets/DirectionArrows/westDark.svg";
import northWestArrowDark from "../../assets/DirectionArrows/northWestDark.svg";

export const Guess = ({ guessed, guess, targetStation, guessedLines }) => {
  const [nodes, setNodes] = useState(null);
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      const { nodes, edges } = await loadGraphFromTGF("adjacencyList.tgf");
      setNodes(nodes);
      setGraph(buildGraph(edges));
    };

    fetchGraph();
  }, []);

  const up =
    localStorage.getItem("theme") === "light" ? arrowMap["up"] : upArrowDark;
  const northEast =
    localStorage.getItem("theme") === "light"
      ? arrowMap["northEast"]
      : northEastArrowDark;
  const east =
    localStorage.getItem("theme") === "light"
      ? arrowMap["east"]
      : eastArrowDark;
  const southEast =
    localStorage.getItem("theme") === "light"
      ? arrowMap["southEast"]
      : southEastArrowDark;
  const down = localStorage.getItem("theme") === "light" ? arrowMap["down"] : downArrowDark;
  const southWest =
    localStorage.getItem("theme") === "light"
      ? arrowMap["southWest"]
      : southWestArrowDark;
  const west =
    localStorage.getItem("theme") === "light"
      ? arrowMap["west"]
      : westArrowDark;
  const northWest =
    localStorage.getItem("theme") === "light"
      ? arrowMap["northWest"]
      : northWestArrowDark;

  const calculateDirection = (guessCoordinates) => {
    return [
      targetStation.coordinates[0] - guessCoordinates[0],
      targetStation.coordinates[1] - guessCoordinates[1],
    ];
  };

  const chooseArrow = (direction) => {
    const x = direction[0];
    const y = direction[1];
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
    }
    if (x === 0 && y === 0) {
      return "correct";
    } else {
      if (y <= 25) {
        return west;
      } else if (x >= -25) {
        return down;
      } else {
        return southWest;
      }
    }
  };

  const direction =
    guess && guess.coordinates && targetStation && targetStation.coordinates
      ? calculateDirection(guess.coordinates)
      : null;
  const arrow = direction ? chooseArrow(direction) : null;

  const nameToId =
    nodes &&
    Object.entries(nodes).reduce((acc, [id, name]) => {
      acc[name] = Number(id);
      return acc;
    }, {});

  const stopsAway =
    guess &&
    guess.name &&
    targetStation &&
    targetStation.name &&
    graph &&
    nameToId
      ? bfsDistance(graph, nameToId[guess.name], nameToId[targetStation.name])
      : null;

  const name = guess && guess.name ? guess.name : null;
  const lines = guess && guess.lines ? guess.lines : null;
  
  if (name && targetStation && name === targetStation.name) {
    return (
      <div className="correct-guess">
        <div className="station-name-correct">{name}</div>
        <h6 className="correct-guess-extra-message">Deje bajar antes de subir</h6>
      </div>
    );
  }

  return (
    <div className={`guess-card ${guessed ? "guessed" : "not-guessed"}`}>
      <div className="left">
        {name && <div className="station-name">{name}</div>}
        {lines && (
          <div className="lines">
            {lines.map((line) => {
              const circle =
                targetStation && guessedLines.has(line) && !targetStation.lines.includes(line)
                  ? wrongCircleMap[`circle${line}Wrong`]
                  : circleMap[`circle${line}`];
              return (
                <img
                  className="circle"
                  key={line}
                  src={circle}
                  alt={`Line ${line}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {guessed && stopsAway !== 0 && (
        <div className="right">
          <div className="stops-away">
            {stopsAway} {stopsAway === 1 ? "parada" : "paradas"}
          </div>
          {arrow !== "correct" && (
            <div className="direction">
              <img src={arrow} alt="direction" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
