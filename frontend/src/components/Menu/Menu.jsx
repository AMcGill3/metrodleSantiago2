import "./Menu.css";
import exitMenu from "../../assets/exitMenu.png";

export const Menu = ({ toggleMenu, toggleHowToPlay, toggleAbout }) => {

  return (
    <div className="menu">
      <button className="exit-menu" onClick={toggleMenu}>
        <img src={exitMenu} className="exit-menu-img"></img>
      </button>
      <div>
        <button className="menu-item" onClick={toggleHowToPlay}>Cómo Jugar</button>
      </div>
      <div>
        <button className="menu-item">Estadísticas</button>
      </div>
      <div>
        <button className="menu-item">Marcador</button>
      </div>
      <div>
        <button className="menu-item">Tema</button>
      </div>
      <div>
        <button className="menu-item" onClick={toggleAbout}>Sobre</button>
      </div>
    </div>
  );
};
