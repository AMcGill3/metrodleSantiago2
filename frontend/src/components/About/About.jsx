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
        <button className="exit-about-button" onClick={toggleAbout}>
          <img src={exit} className="exit-menu-img"></img>
        </button>
      </div>
      <p>
        Este juego fue inspirada por el juego{" "}
        <a href="https://metrodle.com">Metrodle</a> y el tiempo que viví en la
        ciudad de Santiago.
        <br></br>
        <br></br>
        Con gracias a mi amigo Sebastian Ávila por su amistad e apoyo, los
        creadores del juego original por dándome su permiso hacer este juego, y
        todas las personas que me apoyaban durante el proceso
      </p>
    </div>
  );
};
