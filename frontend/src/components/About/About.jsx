import "./About.css";
import exitMenu from "../../assets/exitMenu.png";
import exitMenuDark from "../../assets/exitMenuDark.svg";
import logo from "../../assets/pageLogo.svg";

export const About = ({ toggleAbout, theme }) => {
  const exit = theme === "light" ? exitMenu : exitMenuDark;

  return (
    <div className="about">
      <div className="header">
        <img src={logo} className="logo"></img>
        <h1 className="menuComponentTitle">Sobre</h1>
        <button
          className="exit-about-button"
          onClick={toggleAbout}
          alt={"salir de la sección sobre"}
        >
          <img src={exit} className="exit-menu-img" alt={""}></img>
        </button>
      </div>
      <p>
        Este juego fue inspirada por el juego{" "}
        <a href="https://metrodle.com" target="_blank" rel="noreferrer">
          Metrodle
        </a>{" "}
        y el tiempo que viví en la ciudad de Santiago.
        <br></br>
        <br></br>
        Gracias a mis amigxs Sebastian Ávila, Jack Misner, y Emilia Bland por su
        amistad y apoyo, a los creadores del juego original por darme su permiso
        para hacer este juego, y todas las personas que me han apoyado durante
        el proceso.
      </p>
    </div>
  );
};
