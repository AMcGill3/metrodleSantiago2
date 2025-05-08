import "./Menu.css";
import exitMenu from "../../assets/exitMenu.png";
import howToPlaySymbol from "../../assets/menuSymbols/howToPlaySymbol.svg"
import aboutSymbol from "../../assets/menuSymbols/aboutSymbol.svg";
import themeSymbol from "../../assets/menuSymbols/themeSymbol.svg";
import statisticsSymbol from "../../assets/menuSymbols/statisticsSymbol.svg";
import leaderboardSymbol from "../../assets/menuSymbols/leaderboardSymbol.svg";

export const Menu = ({ toggleMenu, toggleHowToPlay, toggleAbout }) => {
  return (
    <div className="menu">
      <button className="exit-menu" onClick={toggleMenu}>
        <img src={exitMenu} className="exit-menu-img"></img>
      </button>
      <div className="menu-item" onClick={toggleHowToPlay}>
        <img className="menuSymbol" src={howToPlaySymbol}></img>
        <h4>Cómo Jugar</h4>
      </div>
      <div className="menu-item">
        <img className="menuSymbol" src={statisticsSymbol}></img>
        <h4>Estadísticas</h4>
      </div>
      <div className="menu-item">
        <img className="menuSymbol" src={leaderboardSymbol}></img>
        <h4>Marcador</h4>
      </div>
      <div className="menu-item">
        <img className="menuSymbol" src={themeSymbol}></img>
        <h4>Tema</h4>
      </div>
      <div className="menu-item" onClick={toggleAbout}>
        <img className="menuSymbol" src={aboutSymbol}></img>
        <h4>Sobre</h4>
      </div>
    </div>
  );
};
