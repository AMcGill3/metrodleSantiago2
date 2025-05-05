import "./About.css";
import exitMenu from "../../assets/exitMenu.png";

export const About = ({ toggleAbout }) => {
  return (
    <div className="how-to-play">
      <button className="exit-about-button" onClick={toggleAbout}>
        <img src={exitMenu} className="exit-menu-img"></img>
      </button>
      <h1>Sobre</h1>
      <p>
        Este juego fue inspirada por el juego{" "}
        <a href="https://metrodle.com">Metrodle</a> y el tiempo que viví en la
        ciudad de Santiago.
      </p>
    </div>
  );
};
