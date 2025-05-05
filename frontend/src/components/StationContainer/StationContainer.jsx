import circleMap from "../../utils/loadLineCircleSVGs";
import "./StationContainer.css";

export const StationContainer = ({ filteredStations, setFilteredStations }) => {
  return (
    <div className="station-container">
      {filteredStations.map((station, index) => (
        <div
          className="station"
          key={index}
          onClick={() => setFilteredStations([station])}
        >
          <div className="station-name">{station.name.toUpperCase()}</div>
          <div className="station-circles">
            {station.lines.map((line) => {
              const circle = circleMap[`circle${line}`];
              return <img key={line} src={circle} alt={`Line ${line}`} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
