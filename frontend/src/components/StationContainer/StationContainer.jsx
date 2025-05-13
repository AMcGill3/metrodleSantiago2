import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import "./StationContainer.css";

export const StationContainer = ({
  search,
  filteredStations,
  setFilteredStations,
  guessedLines,
  targetStation,
  guesses,
  normalize,
}) => {

  return (
    <div className="station-container">
      {search.length > 0 && filteredStations.length === 0 ? (
        <div className="no-results">
          <span className="no-results-text">{search.toUpperCase()}</span>
        </div>
      ) : (
        filteredStations.map((station, index) => {
          const normalizedName = normalize(station.name);
          const normalizedSearch = normalize(search);
          const isGuessed = guesses.includes(station);
          const matchLength = normalizedName.startsWith(normalizedSearch)
            ? normalizedSearch.length
            : 0;

          const start = station.name.slice(0, matchLength);
          const rest = station.name.slice(matchLength);

          return (
            <div
              className={`station ${isGuessed ? "guessed" : ""}`}
              key={index}
              onClick={() => setFilteredStations([station])}
            >
              <div className="station-name">
                <span className="highlight">{start.toUpperCase()}</span>
                {rest.toUpperCase()}
              </div>
              <div className="station-circles">
                {station.lines.map((line) => {
                  const circle =
                    guessedLines.has(line) &&
                    !targetStation.lines.includes(line)
                      ? wrongCircleMap[`circle${line}Wrong`]
                      : circleMap[`circle${line}`];
                  return <img key={line} src={circle} alt={`Line ${line}`} />;
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
