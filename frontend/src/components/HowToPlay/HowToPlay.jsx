import "./HowToPlay.css";
import exitMenu from "../../assets/exitMenu.png";
import exitMenuDark from "../../assets/exitMenuDark.svg";
import map from "../../assets/metroMapBackground.svg";
import lineMap from "../../utils/loadLinesPngs";
import stationMap from "../../utils/loadStationSvgs";
import { Guess } from "../guessContainer/Guess";
import logo from "../../assets/pageLogo.svg";

export const HowToPlay = ({
  toggleHowToPlay,
  stations,
  theme,
  graph,
  nameToId,
  stopsFromTarget,
  linesLoaded
}) => {
  const getStation = (name) => {
    return stations.find((station) => station.name === name);
  };

  const exit = theme === "light" ? exitMenu : exitMenuDark;

  const santalucía = getStation("Santa Lucía");
  const universidadCatólica = getStation("Universidad Católica");
  return (
    <div className="how-to-play">
      <div className="header">
        <img src={logo} className="logo"></img>
        <button className="exit-how-to-play-button" onClick={toggleHowToPlay}>
          <img src={exit} className="exit-menu-img"></img>
        </button>
        <h1 className="menuComponentTitle">Cómo Jugar</h1>
      </div>
      <p>
        El objeto de Metrodle es adivinar tu destino en el metro de Santiago. El
        mapa en pantalla tiene una sección en zoom de tu trayecto, con la
        estación objetivo en el centro.
      </p>
      <p>Tienes 6 intentos para llegar a tu destino.</p>
      <p>El mapa comienza sin nombres de estaciones y las líneas sin color.</p>
      <div
        className="map-container"
        style={{
          margin: "0 auto",
          border: "0.5px solid black",
        }}
      >
        <img
          className="map"
          src={map}
          alt="Metro Map"
          style={{
            position: "absolute",
            width: "1705px",
            height: "1705px",
            left: "-855px",
            top: "-446px",
          }}
        />
        {linesLoaded && Object.entries(lineMap).map(([name, src]) => {
          return (
            <img
              className="line-blockers"
              key={name}
              src={src}
              alt={name}
              style={{
                position: "absolute",
                width: "1705px",
                height: "1705px",
                left: "-855px",
                top: "-446px",
              }}
            ></img>
          );
        })}
      </div>
      <p>
        Una suposición incorrecta mostrará el nombre de cualquier estación y el
        color de cualquier linea que aparezcan en la zona del mapa con zoom.
      </p>
      <div
        className="map-container"
        style={{
          margin: "0 auto",
          border: "0.5px solid black",
        }}
      >
        <img
          className="map"
          src={map}
          alt="Metro Map"
          style={{
            position: "absolute",
            width: "1705px",
            height: "1705px",
            left: "-855px",
            top: "-446px",
          }}
        />
        {linesLoaded && Object.entries(lineMap).map(([name, src]) => {
          {
            if (name !== "1")
              return (
                <img
                  className="line-blockers"
                  key={name}
                  src={src}
                  alt={name}
                  style={{
                    position: "absolute",
                    width: "1705px",
                    height: "1705px",
                    left: "-855px",
                    top: "-446px",
                  }}
                ></img>
              );
          }
        })}
        {Object.entries(stationMap).map(([name, src]) => {
          if (name === "santalucía") {
            return (
              <img
                className="station-labels"
                key={name}
                src={src}
                alt={name}
                style={{
                  position: "absolute",
                  width: "1705px",
                  height: "1705px",
                  left: "-855px",
                  top: "-446px",
                }}
              ></img>
            );
          }
        })}
      </div>
      <p>
        El resultado de la suposición revelará a cuantas paradas estas de tu
        destino y en que dirección estas de tu suposición.
      </p>
      <Guess
        guessed={true}
        guess={santalucía}
        targetStation={universidadCatólica}
        guessedLines={new Set("1")}
        graph={graph}
        nameToId={nameToId}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={true}
      ></Guess>
    </div>
  );
};
