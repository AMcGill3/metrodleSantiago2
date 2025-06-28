import fullMap from "../../assets/fullMapImage.svg"
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
      <button className="exit-map-button" onClick={toggleFullMap} alt={"salir de mapa"}>
        <img className="exit-menu-img" src={exitMapSymbol}></img>
      </button>
      <div className="map">
        <img className="map-background" src={fullMap} alt={"mapa completa"}></img>
        {guesses.map((guess, guessIndex) => {
          return (
            <div
              key={guessIndex}
              className="guess-animations"
              data-testid="guess-animations"
              style={{
                left: guess.coordinates[0] - 50,
                top: guess.coordinates[1] - 50,
              }}
            ></div>
          );
        })}
        {!checkWin() && (<div
          className="target-animation-fail"
          data-testid="target-animation-fail"
          style={{
            left: targetStation.coordinates[0] - 50,
            top: targetStation.coordinates[1] - 50,
          }}
        ></div>)}
      </div>
    </>
  );
};
