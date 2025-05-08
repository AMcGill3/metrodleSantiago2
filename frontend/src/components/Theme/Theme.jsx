import "./Theme.css";
import exitButton from "../../assets/exitMenu.png";
import exitButtonDark from "../../assets/exitMenuDark.svg";

export const Theme = ({ toggleThemePanel, toggleTheme }) => {
  const exit =
    localStorage.getItem("theme") === "light" ? exitButton : exitButtonDark;
  return (
    <>
      <button className="close-theme-selector" onClick={toggleThemePanel}>
        <img src={exit} className="exit-menu-img"></img>
      </button>
      <h1>Tema</h1>
      <div className="theme-buttons">
        <button className="theme-button" onClick={() => toggleTheme("system")}>
          Predeterminado
        </button>
        <button className="theme-button" onClick={() => toggleTheme("light")}>
          Claro
        </button>
        <button className="theme-button" onClick={() => toggleTheme("dark")}>
          Oscuro
        </button>
      </div>
    </>
  );
};
