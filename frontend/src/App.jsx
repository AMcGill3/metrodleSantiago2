import "./App.css";
import { Keyboard } from "./components/Keyboard/Keyboard";
import { GuessContainer } from "./components/guessContainer/GuessContainer";
import { HowToPlay } from "./components/HowToPlay/HowToPlay";
import { About } from "./components/About/About";
import { Menu } from "./components/Menu/Menu";
import { Theme } from "./components/Theme/Theme";
import { StationContainer } from "./components/StationContainer/StationContainer";
import map from "../src/assets/metroMapBackground.svg";
import lineMap from "./utils/loadLinesSVGs";
import stationMap from "./utils/loadStationSvgs";
import { useState, useEffect } from "react";
import { updateUser, createUser, getUser } from "./services/users";
import { getTargetStation } from "./services/stations";

function App() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showAbout, setAbout] = useState(false);
  const [search, setSearch] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const stored = localStorage.getItem("guesses");
    if (stored) {
      return JSON.parse(stored);
    } else {
      const emptyArray = [];
      localStorage.setItem("guesses", JSON.stringify(emptyArray));
      return emptyArray;
    }
  })
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);

  const [guessedLines, setGuessedLines] = useState(() => {
    const stored = localStorage.getItem("guessedLines");
  
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        } else {
          console.warn("guessedLines in localStorage is not an array. Resetting.");
        }
      } catch (err) {
        console.error("Failed to parse guessedLines from localStorage:", err);
      }
    }
  
    // If no valid stored value, initialise empty set and save it
    const emptySet = new Set();
    localStorage.setItem("guessedLines", JSON.stringify([...emptySet]));
    return emptySet;
  });

const [guessedStationNames, setGuessedStationNames] = useState(() => {
    const stored = localStorage.getItem("guessedStationNames");
    if (stored) {
      return JSON.parse(stored);
    } else {
      const emptyArray = [];
      localStorage.setItem("guessedStationNames", JSON.stringify(emptyArray));
      return emptyArray;
    }
  })  
  const [targetStation, setTargetStation] = useState(null);
  // const [totalJourney, setTotalJourney] = useState([])
  const [theme, setTheme] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  useEffect(() => {
    async function fetchTarget() {
      try {
        const res = await getTargetStation(); // { station: {...} }
        if (res?.station) {
          setTargetStation(res.station);
        }
      } catch (err) {
        console.error("Failed to load target station:", err);
      }
    }
  
    fetchTarget();
  }, [targetStation]);

  // const updateTotalJourney = () => {

  // }
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
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("stations.json")
      .then((response) => response.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations", err));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showMenu === false) {
        if (/^[a-zA-ZñÑ]$/.test(e.key) && !e.metaKey && !e.shiftKey) {
          setSearch(search + e.key);
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          setSearch(search.substring(0, search.length - 1));
        }
        if (e.key === "Enter" && !e.shiftKey && filteredStations.length === 1) {
          makeGuess();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu, search, filteredStations]);

  useEffect(() => {
    if (search.trim() !== "") {
      const filtered = stations.filter((station) =>
        normalize(station.name).startsWith(normalize(search))
      );
      setFilteredStations(
        filtered.length > 0
          ? [
              ...filtered.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
              ),
            ]
          : []
      );
    } else {
      setFilteredStations([]);
    }
  }, [search, stations]);

  useEffect(() => {
    if (!document.cookie.includes("userId")) {
      setIsNewUser(true);
      createUser().then((username) => {
        document.cookie = `userId=${username}; path=/;`;
        console.log("cookie set", document.cookie);
      });
      setShowHowToPlay(true);
    }
  }, []);

  useEffect(() => {
    if (isNewUser && !showHowToPlay) {
      setIsNewUser(false);
    }
  }, [isNewUser, showHowToPlay]);

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/(?<=[aeiouAEIOU])\u0301/g, "")
      .normalize("NFC")
      .toLowerCase()
      .replace(/\s+/g, "");

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleHowToPlay = () => {
    setShowHowToPlay((prev) => !prev);
    if (showMenu) {
      toggleMenu();
    }
  };

  const toggleAbout = () => {
    setAbout((prev) => !prev);
    if (showMenu) {
      toggleMenu();
    }
  };

  const toggleThemePanel = () => {
    setShowThemePanel((prev) => !prev);
    if (showMenu) {
      toggleMenu();
    }
  };

  const makeGuess = () => {
    setGuesses((prev) => {
      const updated = ([...prev, filteredStations[0]])
      localStorage.setItem("guesses", JSON.stringify(updated))
      return updated
    });
    setGuessedLines((prev) => {
      const updated = new Set([...prev, ...filteredStations[0].lines]);
      localStorage.setItem("guessedLines", JSON.stringify([...updated]));
      return updated;
    });
    setGuessedStationNames((prev) => {
      const updated = ([...prev, normalize(filteredStations[0].name)])
      localStorage.setItem("guessedStationNames", JSON.stringify(updated))
      return updated
    });
    setFilteredStations([]);
    setSearch("");
  };
  return (
    <>
      <div
        className={`how-to-play-container ${showHowToPlay ? "open" : "closed"}`}
      >
        <HowToPlay
          toggleHowToPlay={toggleHowToPlay}
          stations={stations}
          theme={theme}
        ></HowToPlay>
      </div>
      <div className={`about-container ${showAbout ? "open" : "closed"}`}>
        <About toggleAbout={toggleAbout} theme={theme}></About>
      </div>
      <div
        className={`theme-panel-container ${
          showThemePanel ? "open" : "closed"
        }`}
      >
        <Theme
          toggleThemePanel={toggleThemePanel}
          toggleTheme={toggleTheme}
          theme={theme}
        ></Theme>
      </div>
      <div className={`menu-container ${showMenu ? "open" : "closed"}`}>
        <Menu
          toggleMenu={toggleMenu}
          toggleHowToPlay={toggleHowToPlay}
          toggleAbout={toggleAbout}
          toggleThemePanel={toggleThemePanel}
          theme={theme}
        ></Menu>
      </div>
      {(showMenu || showHowToPlay || showAbout || showThemePanel) && (
        <div className="backdrop"></div>
      )}
      <div className="main-area-container">
        <div className="game-area">
          {!showMenu && (
            <button className="hamburger-button" onClick={toggleMenu}>
              <svg
                className={`svgIcon ${theme === "dark" ? "dark" : "light"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
              >
                <g id="a"></g>
                <g id="b">
                  <g id="c">
                    <path d="M35,0H2C.9,0,0,.9,0,2v.67c0,1.1,.9,2,2,2H35c1.1,0,2-.9,2-2v-.67c0-1.1-.9-2-2-2h0Z"></path>
                    <path d="M35,11.17H2c-1.1,0-2,.9-2,2v.67c0,1.1,.9,2,2,2H35c1.1,0,2-.9,2-2v-.67c0-1.1-.9-2-2-2h0Z"></path>
                    <path d="M35,22.33H2c-1.1,0-2,.9-2,2v.67c0,1.1,.9,2,2,2H35c1.1,0,2-.9,2-2v-.67c0-1.1-.9-2-2-2h0Z"></path>
                  </g>
                </g>
              </svg>
            </button>
          )}
          <div
            className="map-container"
            style={{
              width: "200px",
              height: "200px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {!guesses.includes(targetStation) && (<div className="map-centre-animation"></div>)}
            <img
              className="map"
              src={map}
              alt="Metro Map"
              style={{
                position: "absolute",
                width: "1705px",
                height: "1705px",
                left: targetStation
                  ? `-${targetStation.coordinates[0] - 100}px`
                  : "0px",
                top: targetStation
                  ? `-${targetStation.coordinates[1] - 100}px`
                  : "0px",
              }}
            />
            {Object.entries(lineMap).map(([name, src]) => {
              if (!guessedLines.has(name)) {
                return (
                  <img
                    key={name}
                    src={src}
                    alt={name}
                    style={{
                      position: "absolute",
                      width: "1705px",
                      height: "1705px",
                      left: targetStation
                        ? `-${targetStation.coordinates[0] - 100}px`
                        : "0px",
                      top: targetStation
                        ? `-${targetStation.coordinates[1] - 100}px`
                        : "0px",
                    }}
                  ></img>
                );
              }
            })}
            {Object.entries(stationMap).map(([name, src]) => {
              if (guessedStationNames.includes(normalize(name))) {
                return (
                  <img
                    key={name}
                    src={src}
                    alt={name}
                    style={{
                      position: "absolute",
                      width: "1705px",
                      height: "1705px",
                      left: targetStation
                        ? `-${targetStation.coordinates[0] - 100}px`
                        : "0px",
                      top: targetStation
                        ? `-${targetStation.coordinates[1] - 100}px`
                        : "0px",
                    }}
                  ></img>
                );
              }
            })}
          </div>
        </div>
        <div className="guess-list-container">
          <GuessContainer
            guesses={guesses}
            targetStation={targetStation}
            guessedLines={guessedLines}
          ></GuessContainer>
        </div>
        {search.length > 0 && (
          <div className="stations-container">
            <StationContainer
              search={search}
              stations={stations}
              setFilteredStations={setFilteredStations}
              filteredStations={filteredStations}
              guessedLines={guessedLines}
              targetStation={targetStation}
              guesses={guesses}
              normalize={normalize}
            ></StationContainer>
          </div>
        )}
      </div>
      <div className="keyboard-container">
        <Keyboard
          search={search}
          setSearch={setSearch}
          filteredStations={filteredStations}
          makeGuess={makeGuess}
          normalize={normalize}
        ></Keyboard>
      </div>
    </>
  );
}

export default App;
