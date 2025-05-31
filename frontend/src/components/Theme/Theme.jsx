import "./Theme.css";
import exitButton from "../../assets/exitMenu.png";
import exitButtonDark from "../../assets/exitMenuDark.svg";
import { useState } from "react";

export const Theme = ({ toggleThemePanel, theme, setTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState("system");
  const exit = theme === "light" ? exitButton : exitButtonDark;

  const toggleTheme = (mode) => {
    if (mode === "system") {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else if (mode === "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    setSelectedTheme(mode)
  };
  return (
    <>
      <button className="close-theme-selector" onClick={toggleThemePanel}>
        <img src={exit} className="exit-menu-img"></img>
      </button>
      <h1>Tema</h1>
      <div className="theme-buttons">
        <button
          className={`theme-button ${selectedTheme === "system" ? "selected" : ""}`}
          onClick={() => toggleTheme("system")}
        >
          Predeterminado
        </button>
        <button className={`theme-button ${selectedTheme === "light" ? "selected" : ""}`} onClick={() => toggleTheme("light")}>
          Claro
        </button>
        <button className={`theme-button ${selectedTheme === "dark" ? "selected" : ""}`} onClick={() => toggleTheme("dark")}>
          Oscuro
        </button>
      </div>
    </>
  );
};
