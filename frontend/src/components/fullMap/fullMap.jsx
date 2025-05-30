import map from "../../assets/metroMapBackground.svg";
import stationMap from "../../utils/loadStationSvgs";
import nationalRailStations from "../../assets/NationalRailStations.svg";
import exitMapSymbol from "../../assets/exitMenu.png";
import "./fullMap.css";

export const FullMap = ({
  toggleFullMap,
  guesses,
  targetStation,
  checkWin,
}) => {
  return (
    <>
      <button className="exit-map-button" onClick={toggleFullMap}>
        <img className="exit-menu-img" src={exitMapSymbol}></img>
      </button>
      <div className="map">
        <img className="map-background" src={map}></img>
        {Object.entries(stationMap).map(([name, src]) => {
          return (
            <img className="stations" key={name} src={src} alt={name}></img>
          );
        })}
        <img
          className="national-rail-stations-full-map"
          src={nationalRailStations}
        ></img>
        {guesses.map((guess, guessIndex) => {
          return (
            <div
              key={guessIndex}
              className="guess-animations"
              style={{
                left: guess.coordinates[0] - 50,
                top: guess.coordinates[1] - 50,
              }}
            ></div>
          );
        })}
        {!checkWin() && (<div
          className="target-animation-fail"
          style={{
            left: targetStation.coordinates[0] - 50,
            top: targetStation.coordinates[1] - 50,
          }}
        ></div>)}
      </div>
    </>
  );
};
