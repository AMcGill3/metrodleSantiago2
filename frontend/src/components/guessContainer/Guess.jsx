import "./Guess.css";
import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import arrowMap from "../../utils/loadArrowSVGs";
import { loadGraphFromTGF } from "../../utils/loadGraphFromTGF.js";
import { buildGraph, bfsDistance } from "../../utils/graphUtils.js";
import { useEffect, useState } from "react";

export const Guess = ({ guessed, guess, targetStation }) => {
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

  const calculateDirection = (guessCoordinates) => {
    return [
      targetStation.coordinates[0] - guessCoordinates[0],
      targetStation.coordinates[1]- guessCoordinates[1],
    ];
  };

  const chooseArrow = (direction) => {
    const x = direction[0];
    const y = direction[1];
    if (x > 0 && y >= 0) {
      if (y <= 50) {
        return arrowMap["east"];
      } else if (x <= 50) {
        return arrowMap["down"];
      } else {
        return arrowMap["southEast"];
      }
    } else if (x > 0 && y <= 0) {
      if (y >= -50) {
        return arrowMap["east"];
      } else if (x <= 50) {
        return arrowMap["up"];
      } else {
        return arrowMap["northEast"];
      }
    } else if (x < 0 && y < 0) {
      if (y >= -50) {
        return arrowMap["west"];
      } else if (x <= 50) {
        return arrowMap["up"];
      } else {
        return arrowMap["northWest"];
      }
    }
    if (x === 0 && y === 0) {
      return "correct";
    } else {
      if (y <= 50) {
        return arrowMap["west"];
      } else if (x >= -50) {
        return arrowMap["down"];
      } else {
        return arrowMap["southWest"];
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
  targetStation && targetStation.name && console.log("target: ", targetStation.name)
  return (
<div className={`guess-card ${guessed ? "guessed" : "not-guessed"}`}>
  <div className="left">
    {name && <div className="station-name">{name}</div>}
    {lines && (
      <div className="lines">
        {lines.map((line) => {
          const circle = circleMap[`circle${line}`];
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
