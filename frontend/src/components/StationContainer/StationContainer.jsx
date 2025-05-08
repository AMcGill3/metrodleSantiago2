import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import "./StationContainer.css";

export const StationContainer = ({ filteredStations, setFilteredStations, guessedLines, targetStation, guesses }) => {
  return (
    <div className="station-container">
      {filteredStations.map((station, index) => (
        <div
          className={`station ${guesses.includes(station) ? 'guessed' : ''}`}
          key={index}
          onClick={() => setFilteredStations([station])}
        >
          <div className="station-name">{station.name.toUpperCase()}</div>
          <div className="station-circles">
            {station.lines.map((line) => {
              const circle = 
              guessedLines.has(line) && !targetStation.lines.includes(line) ? wrongCircleMap[`circle${line}Wrong`] : circleMap[`circle${line}`]
              return <img key={line} src={circle} alt={`Line ${line}`} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
