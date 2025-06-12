import "./App.css";
import { Keyboard } from "./components/Keyboard/Keyboard";
import { GuessContainer } from "./components/guessContainer/GuessContainer";
import { HowToPlay } from "./components/HowToPlay/HowToPlay";
import { About } from "./components/About/About";
import { Menu } from "./components/Menu/Menu";
import { Theme } from "./components/Theme/Theme";
import { Stats } from "./components/Stats/Stats";
import { StationContainer } from "./components/StationContainer/StationContainer";
import { CorrectGuess } from "./components/correctGuess/correctGuess";
import map from "../src/assets/metroMapBackground.svg";
import lineMap from "./utils/loadLinesSVGs";
import stationMap from "./utils/loadStationSvgs";
import nationalRailStations from "../src/assets/NationalRailStations.svg";
import { useState, useEffect } from "react";
import { updateUser, createUser, getUser } from "./services/users";
import { getTargetStation } from "./services/stations";
import { normalize } from "../../normalize.js";
import { buildGraph, bfsDistance } from "./utils/graphUtils.js";
import { loadGraphFromTGF } from "../src/utils/loadGraphFromTGF.js";
import { Countdown } from "./components/Countdown/Countdown.jsx";
import { FullMap } from "./components/fullMap/fullMap.jsx";
import fullMapButton from "../src/assets/fullMapButton.svg";
import fullMapButtonDark from "../src/assets/fullMapButtonDark.svg";
import loadingSymbolMorning from "../src/assets/loadingSymbols/loadingSymbolMorning.svg";
import loadingSymbolAfternoon from "../src/assets/loadingSymbols/loadingSymbolAfternoon.svg";
import loadingSymbolEvening from "../src/assets/loadingSymbols/loadingSymbolEvening.svg";

function App() {
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showAbout, setAbout] = useState(false);
  const [search, setSearch] = useState("");
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [guessedLines, setGuessedLines] = useState(new Set());
  const [guessedStationNames, setGuessedStationNames] = useState([]);
  const [targetStation, setTargetStation] = useState(null);
  const [puzzleNumber, setPuzzleNumber] = useState(null)
  const [correctStationPopUp, setCorrectStationPopUp] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const [nodes, setNodes] = useState(null);
  const [graph, setGraph] = useState(null);

  const getStationCoordinates = (name) => {
    const station = stations?.find(
      (s) => s.name.replace(/\s+/g, "").toLowerCase() === name
    );
    return station ? station.coordinates : null;
  };

  useEffect(() => {
    const fetchGraph = async () => {
      const { nodes, edges } = await loadGraphFromTGF("adjacencyList.tgf");
      setNodes(nodes);
      setGraph(buildGraph(edges));
    };

    fetchGraph();
  }, []);

  useEffect(() => {
    async function fetchTarget() {
      try {
        const res = await getTargetStation();
        if (res?.station) {
          setTargetStation(res.station);
          setPuzzleNumber(res.number)
        }
      } catch (err) {
        console.error("Failed to load target station:", err);
      }
    }

    fetchTarget();
  }, []);

  useEffect(() => {
    fetch("stations.json")
      .then((response) => response.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations", err));
  }, []);

  useEffect(() => {
    if (graph && targetStation && stations && user) {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  }, [graph, targetStation, stations, user]);

  const compareLastPlayed = () => {
    if (!lastPlayed) return false;
    return lastPlayed.getTime() === today.getTime();
  };

  const checkWin = () => {
    return guessedStationNames?.includes(normalize(targetStation?.name));
  };

  let targetX = targetStation?.coordinates[0];

  let targetY = targetStation?.coordinates[1];

  function tooClose(coordinate) {
    return coordinate < 150;
  }
  const tooFar = (coordinate) => {
    return coordinate > 1550;
  };

  const nameToId =
    nodes &&
    Object.entries(nodes).reduce((acc, [id, name]) => {
      acc[name] = Number(id);
      return acc;
    }, {});
  useEffect(() => {
    async function initializeUser() {
      let username = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1];

      if (!username) {
        try {
          username = await createUser();
          document.cookie = `userId=${username}; path=/;`;
          console.log("cookie set", document.cookie);
          setShowHowToPlay(true);
        } catch (err) {
          console.error("Failed to create user:", err);
          return;
        }
      }

      try {
        const userData = await getUser(username);
        setUser(userData);
        if (userData?.game) {
          setGuesses(userData.game.guesses || []);
          setGuessedLines(new Set(userData.game.guessedLines || []));
          setGuessedStationNames(userData.game.guessedStationNames || []);
          const date = new Date(userData.lastPlayed);
          date.setHours(0, 0, 0, 0);
          setLastPlayed(date);
        }
      } catch (err) {
        console.error("Failed to load user game data:", err);
      }
    }

    initializeUser();
  }, []);

  useEffect(() => {
    if (!loading && compareLastPlayed()) {
      setTimeout(() => {
        setShowStats(true);
      }, 200);
    }
  }, [loading, lastPlayed]);

  const stopsFromTarget = (stationName) => {
    if (
      !graph ||
      !targetStation ||
      !nameToId?.[stationName] ||
      !nameToId?.[targetStation.name]
    ) {
      return null;
    }
    return bfsDistance(
      graph,
      nameToId[stationName],
      nameToId[targetStation.name]
    );
  };

  // end game logic
  useEffect(() => {
    if (!targetStation) return;
    if (
      !compareLastPlayed() &&
      (checkWin() || (guessedStationNames.length === 6 && !checkWin()))
    ) {
      setCorrectStationPopUp(true);
      setTimeout(async () => {
        setCorrectStationPopUp(false);
        const updatedUser = await getUser(user.username);
        setUser(updatedUser);
        setShowStats(true);
        setLastPlayed(today);
      }, 4000);
    }

    if (checkWin() && !compareLastPlayed()) {
      updateUser(user?.username, true, today, guessedStationNames.length);
    } else if (
      guessedStationNames.length === 6 &&
      !checkWin() &&
      !compareLastPlayed()
    ) {
      updateUser(user?.username, false, today);
    }
  }, [guessedStationNames]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

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

  const toggleStats = () => {
    setShowStats((prev) => !prev);
    if (showMenu) {
      toggleMenu();
    }
  };

  const toggleFullMap = () => {
    setShowFullMap((prev) => !prev);
  };
  if (loading) {
    const t = new Date().getHours();
    return (
      <div className="loading-screen">
        {t < 12 && <img src={loadingSymbolMorning}></img>}
        {t < 18 && t >= 12 && <img src={loadingSymbolAfternoon}></img>}
        {t >= 18 && t < 24 && <img src={loadingSymbolEvening}></img>}
      </div>
    );
  }

  return (
    <>
      <div className={`stats-container ${showStats ? "open" : "closed"}`}>
        <Stats
          toggleStats={toggleStats}
          theme={theme}
          user={user}
          today={today}
          targetStation={targetStation}
          lastPlayed={lastPlayed}
          compareLastPlayed={compareLastPlayed}
          stopsFromTarget={stopsFromTarget}
          checkWin={checkWin}
          puzzleNumber={puzzleNumber}
        ></Stats>
      </div>
      <div
        className={`how-to-play-container ${showHowToPlay ? "open" : "closed"}`}
      >
        <HowToPlay
          toggleHowToPlay={toggleHowToPlay}
          stations={stations}
          theme={theme}
          graph={graph}
          nameToId={nameToId}
          stopsFromTarget={stopsFromTarget}
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
          theme={theme}
          setTheme={setTheme}
        ></Theme>
      </div>
      <div className={`menu-container ${showMenu ? "open" : "closed"}`}>
        <Menu
          toggleMenu={toggleMenu}
          toggleHowToPlay={toggleHowToPlay}
          toggleAbout={toggleAbout}
          toggleThemePanel={toggleThemePanel}
          toggleStats={toggleStats}
          theme={theme}
        ></Menu>
      </div>
      {showFullMap && (
        <div className="full-map-container">
          <FullMap
            toggleFullMap={toggleFullMap}
            guesses={guesses}
            targetStation={targetStation}
            checkWin={checkWin}
          ></FullMap>
        </div>
      )}
      {(showMenu ||
        showHowToPlay ||
        showAbout ||
        showThemePanel ||
        correctStationPopUp ||
        showStats) && <div className="backdrop"></div>}
      <div className="main-area-container">
        {compareLastPlayed() && (
          <button className="full-map-button" onClick={toggleFullMap}>
            <img
              className="full-map-button-img"
              src={theme === "light" ? fullMapButton : fullMapButtonDark}
            ></img>
          </button>
        )}
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
          <div className="map-container">
            {targetStation && (
              <div
                className="map-centre-animation"
                style={{
                  left: `${
                    tooClose(targetX)
                      ? targetX - 50
                      : tooFar(targetX)
                      ? targetX - 1505 - 50
                      : 50
                  }px`,
                  top: `${
                    tooClose(targetY)
                      ? targetY - 50
                      : tooFar(targetY)
                      ? targetY - 1505 - 50
                      : 50
                  }px`,
                }}
              ></div>
            )}

            <img
              className="map"
              src={map}
              alt="Metro Map"
              style={{
                position: "absolute",
                width: "1705px",
                height: "1705px",
                left: targetStation
                  ? tooClose(targetX) || tooFar(targetX)
                    ? tooClose(targetX)
                      ? "0px"
                      : "1505px"
                    : `-${targetX - 100}px`
                  : "0px",
                top: targetStation
                  ? tooClose(targetY) || tooFar(targetY)
                    ? tooClose(targetY)
                      ? "0px"
                      : "-1505px"
                    : `-${targetY - 100}px`
                  : "0px",
              }}
            />
            {Object.entries(lineMap).map(([name, src]) => {
              if (!guessedLines.has(name) && !compareLastPlayed()) {
                return (
                  <img
                    className="line-blockers"
                    key={name}
                    src={src}
                    alt={`bloqueador de línea`}
                    style={{
                      position: "absolute",
                      width: "1705px",
                      height: "1705px",
                      left: targetStation
                        ? tooClose(targetX) || tooFar(targetX)
                          ? tooClose(targetX)
                            ? "0px"
                            : "1505px"
                          : `-${targetX - 100}px`
                        : "0px",
                      top: targetStation
                        ? tooClose(targetY) || tooFar(targetY)
                          ? tooClose(targetY)
                            ? "0px"
                            : "-1505px"
                          : `-${targetY - 100}px`
                        : "0px",
                    }}
                  ></img>
                );
              }
            })}
            {Object.entries(stationMap).map(([name, src]) => {
              const guessCoordinates = getStationCoordinates(name);
              const close =
                guessCoordinates &&
                targetStation &&
                Math.abs(targetStation.coordinates[0] - guessCoordinates[0]) <=
                  150 &&
                Math.abs(targetStation.coordinates[1] - guessCoordinates[1]) <=
                  150;
              if (
                close &&
                (compareLastPlayed() ||
                  guessedStationNames.includes(normalize(name)))
              ) {
                return (
                  <img
                    className="station-labels"
                    key={name}
                    src={src}
                    alt={name}
                    style={{
                      position: "absolute",
                      width: "1705px",
                      height: "1705px",
                      left: targetStation
                        ? tooClose(targetX) || tooFar(targetX)
                          ? tooClose(targetX)
                            ? "0px"
                            : "1505px"
                          : `-${targetX - 100}px`
                        : "0px",
                      top: targetStation
                        ? tooClose(targetY) || tooFar(targetY)
                          ? tooClose(targetY)
                            ? "0px"
                            : "-1505px"
                          : `-${targetY - 100}px`
                        : "0px",
                    }}
                  ></img>
                );
              }
            })}
            {compareLastPlayed() && (
              <div className="national-rail-stations">
                <img
                  src={nationalRailStations}
                  style={{
                    position: "absolute",
                    width: "1705px",
                    height: "1705px",
                    left: targetStation
                      ? tooClose(targetX) || tooFar(targetX)
                        ? tooClose(targetX)
                          ? "0px"
                          : "1505px"
                        : `-${targetX - 100}px`
                      : "0px",
                    top: targetStation
                      ? tooClose(targetY) || tooFar(targetY)
                        ? tooClose(targetY)
                          ? "0px"
                          : "-1505px"
                        : `-${targetY - 100}px`
                      : "0px",
                  }}
                ></img>
              </div>
            )}
          </div>
        </div>
        <div
          className={`correct-guess-container ${
            correctStationPopUp ? "open" : "closed"
          }`}
        >
          <CorrectGuess targetStation={targetStation}></CorrectGuess>
        </div>

        <>
          <GuessContainer
            guesses={guesses}
            targetStation={targetStation}
            guessedLines={guessedLines}
            nameToId={nameToId}
            graph={graph}
            stopsFromTarget={stopsFromTarget}
            theme={theme}
          ></GuessContainer>
        </>
        {search.length > 0 && (
          <div className="stations-container">
            <StationContainer
              search={search}
              stations={stations}
              setFilteredStations={setFilteredStations}
              filteredStations={filteredStations}
              guessedLines={guessedLines}
              targetStation={targetStation}
              guessedStationNames={guessedStationNames}
              normalize={normalize}
            ></StationContainer>
          </div>
        )}
      </div>
      {(!compareLastPlayed() || !lastPlayed) && (
        <div className="keyboard-container">
          <Keyboard
            search={search}
            setSearch={setSearch}
            filteredStations={filteredStations}
            setFilteredStations={setFilteredStations}
            setGuesses={setGuesses}
            setGuessedLines={setGuessedLines}
            setGuessedStationNames={setGuessedStationNames}
            normalize={normalize}
            showMenu={showMenu}
            today={today}
            user={user}
          ></Keyboard>
        </div>
      )}
      {compareLastPlayed() && (
        <div className="countdown-container">
          <Countdown
            today={today}
            bfsDistance={bfsDistance}
            nameToId={nameToId}
            graph={graph}
            guesses={guesses}
            compareLastPlayed={compareLastPlayed}
          ></Countdown>
        </div>
      )}
    </>
  );
}

export default App;
