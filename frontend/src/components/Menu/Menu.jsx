import "./Menu.css";
import exitMenu from "../../assets/exitMenu.png";
import exitMenuDark from "../../assets/exitMenuDark.svg";
import howToPlaySymbol from "../../assets/menuSymbols/howToPlaySymbol.svg";
import howToPlaySymbolDark from "../../assets/menuSymbols/howToPlaySymbolDark.svg";
import aboutSymbol from "../../assets/menuSymbols/aboutSymbol.svg";
import aboutSymbolDark from "../../assets/menuSymbols/aboutSymbolDark.svg";
import themeSymbol from "../../assets/menuSymbols/themeSymbol.svg";
import themeSymbolDark from "../../assets/menuSymbols/themeSymbolDark.svg";
import statisticsSymbol from "../../assets/menuSymbols/statisticsSymbol.svg";
import statisticsSymbolDark from "../../assets/menuSymbols/statisticsSymbolDark.svg";
import leaderboardSymbol from "../../assets/menuSymbols/leaderboardSymbol.svg";
import leaderboardSymbolDark from "../../assets/menuSymbols/leaderboardSymbolDark.svg";

export const Menu = ({
  toggleMenu,
  toggleHowToPlay,
  toggleAbout,
  toggleThemePanel,
}) => {
  const exit =
    localStorage.getItem("theme") === "light" ? exitMenu : exitMenuDark;

  const howToPlay =
    localStorage.getItem("theme") === "light"
      ? howToPlaySymbol
      : howToPlaySymbolDark;

  const about =
    localStorage.getItem("theme") === "light" ? aboutSymbol : aboutSymbolDark;

  const themeImage =
    localStorage.getItem("theme") === "light" ? themeSymbol : themeSymbolDark;

  const statistics =
    localStorage.getItem("theme") === "light"
      ? statisticsSymbol
      : statisticsSymbolDark;

  const leaderboard =
    localStorage.getItem("theme") === "light"
      ? leaderboardSymbol
      : leaderboardSymbolDark;

  return (
    <div className="menu">
      <button className="exit-menu" onClick={toggleMenu}>
        <img src={exit} className="exit-menu-img"></img>
      </button>
      <div className="menu-item" onClick={toggleHowToPlay}>
        <img className="menuSymbol" src={howToPlay}></img>
        <h4>Cómo Jugar</h4>
      </div>
      <div className="menu-item">
        <img className="menuSymbol" src={statistics}></img>
        <h4>Estadísticas</h4>
      </div>
      <div className="menu-item">
        <img className="menuSymbol" src={leaderboard}></img>
        <h4>Marcador</h4>
      </div>
      <div className="menu-item" onClick={toggleThemePanel}>
        <img className="menuSymbol" src={themeImage}></img>
        <h4>Tema</h4>
      </div>
      <div className="menu-item" onClick={toggleAbout}>
        <img className="menuSymbol" src={about}></img>
        <h4>Sobre</h4>
      </div>
    </div>
  );
};
