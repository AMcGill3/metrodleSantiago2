import "./HowToPlay.css";
import exitMenu from "../../assets/exitMenu.png";
import map from "../../assets/metroMapBackground.svg";
import lineMap from "../../utils/loadLinesSVGs";
import stationMap from "../../utils/loadStationSvgs";
import { Guess } from "../guessContainer/Guess";

export const HowToPlay = ({ toggleHowToPlay, stations }) => {
  const getStation = (name) => {
    return stations.find((station) => station.name === name);
  };

  const santalucía = getStation("Santa Lucía")
  const universidadCatólica = getStation("Universidad Católica")
  return (
    <div className="how-to-play">
      <button className="exit-how-to-play-button" onClick={toggleHowToPlay}>
        <img src={exitMenu} className="exit-menu-img"></img>
      </button>
      <h1>Cómo Jugar</h1>
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
          width: "200px",
          height: "200px",
          overflow: "hidden",
          position: "relative",
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
            left: "-855px", // Have to minus 100 from this and top to make centered
            top: "-446px",
          }}
        />
        {Object.entries(lineMap).map(([name, src]) => {
          return (
            <img
              key={name}
              src={src}
              alt={name}
              style={{
                position: "absolute",
                width: "1705px",
                height: "1705px",
                left: "-855px", // Have to minus 100 from this and top to make centered
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
          width: "200px",
          height: "200px",
          overflow: "hidden",
          position: "relative",
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
            left: "-855px", // Have to minus 100 from this and top to make centered
            top: "-446px",
          }}
        />
        {Object.entries(lineMap).map(([name, src]) => {
          {
            if (name !== "1")
              return (
                <img
                  key={name}
                  src={src}
                  alt={name}
                  style={{
                    position: "absolute",
                    width: "1705px",
                    height: "1705px",
                    left: "-855px", // Have to minus 100 from this and top to make centered
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
                key={name}
                src={src}
                alt={name}
                style={{
                  position: "absolute",
                  width: "1705px",
                  height: "1705px",
                  left: "-855px", // Have to minus 100 from this and top to make centered
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
      <Guess guessed={true} guess={santalucía} targetStation={universidadCatólica}></Guess>
    </div>
  );
};
