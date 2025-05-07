import "./App.css";
import { Keyboard } from "./components/Keyboard/Keyboard";
import { GuessContainer } from "./components/guessContainer/GuessContainer";
import { HowToPlay } from "./components/HowToPlay/HowToPlay";
import { About } from "./components/About/About";
import { Menu } from "./components/Menu/Menu";
import { StationContainer } from "./components/StationContainer/StationContainer";
import map from "../src/assets/metroMapBackground.svg";
import lineMap from "./utils/loadLinesSVGs";
import stationMap from "./utils/loadStationSvgs";
import { useState, useEffect } from "react";
import { updateUser, createUser, getUser } from "./services/users";

function App() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showAbout, setAbout] = useState(false);
  const [search, setSearch] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [guessedLines, setGuessedLines] = useState(new Set());
  const [guessedStationNames, setGuessedStationNames] = useState([]);
  // const [totalJourney, setTotalJourney] = useState([])

  const setTargetStation = (name) => {
    return stations.find((station) => station.name === name);
  };

  // const updateTotalJourney = () => {

  // }

  useEffect(() => {
    fetch("stations.json")
      .then((response) => response.json())
      .then((data) => setStations(data))
      .catch((err) => console.error("Failed to load stations", err));
  }, []);

  useEffect(() => {
    if (search.trim() !== "") {
      const filtered = stations.filter((station) =>
        station.name.toLowerCase().startsWith(search.toLowerCase())
      );
      setFilteredStations(filtered);
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
      .replace(/[\u0300-\u036f]/g, "")
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

  const makeGuess = () => {
    setGuesses([...guesses, filteredStations[0]]);
    setGuessedLines((prev) => new Set([...prev, ...filteredStations[0].lines]));
    setGuessedStationNames((prev) => [
      ...prev,
      normalize(filteredStations[0].name),
    ]);
    setFilteredStations([]);
    setSearch("");
  };
  const targetStation = setTargetStation("Bio Bío");
  return (
    <>
      <div
        className={`how-to-play-container ${showHowToPlay ? "open" : "closed"}`}
      >
        <HowToPlay toggleHowToPlay={toggleHowToPlay}></HowToPlay>
      </div>
      <div className={`about-container ${showAbout ? "open" : "closed"}`}>
        <About toggleAbout={toggleAbout}></About>
      </div>
      <div className={`menu-container ${showMenu ? "open" : "closed"}`}>
        <Menu
          toggleMenu={toggleMenu}
          toggleHowToPlay={toggleHowToPlay}
          toggleAbout={toggleAbout}
        ></Menu>
      </div>
      {(showMenu || showHowToPlay || showAbout) && (
        <div className="backdrop"></div>
      )}
      <textarea
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="provisional-input"
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey &&
            filteredStations.length === 1
          ) {
            e.preventDefault();
            makeGuess();
          }
        }}
      ></textarea>
      <div className="main-area-container">
        <div className="game-area">
          {!showMenu && (
            <button className="hamburger-button" onClick={toggleMenu}>
              <svg
                className="svgIcon"
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
            <img
              className="map"
              src={map}
              alt="Metro Map"
              style={{
                position: "absolute",
                width: "1705px",
                height: "1705px",
                left: "-815px", // Have to minus 100 from this and top to make centered
                top: "-645.5px",
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
                      left: "-815px", // Have to minus 100 from this and top to make centered
                      top: "-645.5px",
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
                      left: "-815px", // Have to minus 100 from this and top to make centered
                      top: "-645.5px",
                    }}
                  ></img>
                );
              }
            })}
          </div>
        </div>
        <div className="guess-list-container">
          <GuessContainer guesses={guesses} targetStation={targetStation}></GuessContainer>
        </div>
        {filteredStations.length > 0 && (
          <div className="stations-container">
            <StationContainer
              search={search}
              stations={stations}
              setFilteredStations={setFilteredStations}
              filteredStations={filteredStations}
            ></StationContainer>
          </div>
        )}
      </div>
      <div className="keyboard-container">
        <Keyboard></Keyboard>
      </div>
    </>
  );
}

export default App;
