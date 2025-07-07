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
import emailSymbol from "../../assets/menuSymbols/emailSymbol.svg"
import emailSymbolDark from "../../assets/menuSymbols/emailSymbolDark.svg"

export const Menu = ({
  toggleMenu,
  toggleHowToPlay,
  toggleAbout,
  toggleThemePanel,
  toggleStats,
  theme,
}) => {
  const exit = theme === "light" ? exitMenu : exitMenuDark;

  const howToPlay = theme === "light" ? howToPlaySymbol : howToPlaySymbolDark;

  const about = theme === "light" ? aboutSymbol : aboutSymbolDark;

  const themeImage = theme === "light" ? themeSymbol : themeSymbolDark;

  const statistics =
    theme === "light" ? statisticsSymbol : statisticsSymbolDark;

  const email = theme === "light" ? emailSymbol : emailSymbolDark;

  const handleEmail = () => {
    window.location.href = "mailto:alecmcgill5@gmail.com";
  }

  return (
    <>
      <button className="exit-menu" onClick={toggleMenu}>
        <img src={exit} className="exit-menu-img"></img>
      </button>
      <div className="menu-item" onClick={toggleHowToPlay}>
        <img className="menuSymbol" src={howToPlay}></img>
        <h4>Cómo Jugar</h4>
      </div>
      <div className="menu-item" onClick={toggleStats}>
        <img className="menuSymbol" src={statistics}></img>
        <h4>Estadísticas</h4>
      </div>
      <div className="menu-item" onClick={toggleThemePanel}>
        <img className="menuSymbol" src={themeImage}></img>
        <h4>Tema</h4>
      </div>
      <div className="menu-item" onClick={toggleAbout}>
        <img className="menuSymbol" src={about}></img>
        <h4>Sobre</h4>
      </div>
      <div className="menu-item" onClick={handleEmail}>
        <img className="menuSymbol" src={email}></img>
        <h4>Correo</h4>
      </div>
    </>
  );
};
