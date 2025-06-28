import circleMap from "../../utils/loadLineCircleSVGs";
import wrongCircleMap from "../../utils/loadWrongLineCirclesSVGs.js";
import "./StationContainer.css";
import { useEffect } from "react";

export const StationContainer = ({
  search,
  filteredStations,
  setFilteredStations,
  guessedLines,
  targetStation,
  guessedStationNames,
  normalize,
  stations,
  setSearch,
}) => {
  useEffect(() => {
    if (search.trim() !== "") {
      const filtered = stations.filter((station) =>
        normalize(station.name).startsWith(normalize(search))
      );
      setFilteredStations(
        filtered.length > 0
          ? [
              ...filtered.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
              ),
            ]
          : []
      );
    } else {
      setFilteredStations([]);
    }
  }, [search, stations]);

  return (
    <>
      {search.length > 0 && filteredStations.length === 0 ? (
        <div className="no-results">
          <span className="no-results-text">{search.toUpperCase()}</span>
        </div>
      ) : (
        filteredStations.map((station, index) => {
          const normalizedName = normalize(station.name);
          const normalizedSearch = normalize(search);
          const isGuessed = guessedStationNames.includes(normalizedName);
          const matchLength = normalizedName.startsWith(normalizedSearch)
            ? normalizedSearch.length
            : 0;

          const start = station.name
            .toUpperCase()
            .replace(/\s+/g, "")
            .slice(0, matchLength);
          const rest = station.name
            .toUpperCase()
            .replace(/\s+/g, "")
            .slice(matchLength);

          return (
            <div
              className={`station ${isGuessed ? "guessed" : ""}`}
              data-testid={`station${isGuessed ? "-guessed" : ""}`}
              key={index}
              onClick={() => {
                setFilteredStations([station]);
                setSearch(station.name);
              }}
            >
              <div className="station-name">
                <span className="highlight" data-testid="highlight">
                  {start}
                </span>
                {rest}
              </div>
              <div className="station-circles">
                {station.lines.map((line) => {
                  const circle =
                    guessedLines.has(line) &&
                    !targetStation.lines.includes(line)
                      ? wrongCircleMap[`circle${line}Wrong`]
                      : circleMap[`circle${line}`];
                  return <img key={line} src={circle} alt={`Línea ${line}`} />;
                })}
              </div>
            </div>
          );
        })
      )}
    </>
  );
};
