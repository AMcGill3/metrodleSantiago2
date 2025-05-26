import "./Keyboard.css";
import { Key } from "./Key";
import deleteSymbol from "../../assets/deleteSymbol.png";
import { useEffect } from "react";
import { getUser, makeGuess } from "../../services/users";

export const Keyboard = ({
  search,
  setSearch,
  filteredStations,
  setFilteredStations,
  setGuesses,
  setGuessedLines,
  setGuessedStationNames,
  normalize,
  showMenu,
  today,
}) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  useEffect(() => {
    const handleKeyDown = async (e) => {
      const username = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId"))
        ?.split("=")[1];
      const user = await getUser(username);
      if (showMenu === false && user.lastPlayed !== today) {
        if (/^[a-zA-ZñÑ]$/.test(e.key) && !e.metaKey && !e.shiftKey) {
          setSearch(search + e.key);
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          setSearch(search.substring(0, search.length - 1));
        }
        if (e.key === "Enter" && !e.shiftKey && filteredStations.length === 1) {
          const guess = filteredStations[0];
          makeGuess(username, guess);
          setGuesses((prevGuesses) => {
            setGuessedLines((prevLines) => {
              const newLines = new Set(prevLines);
              guess.lines.forEach((line) => newLines.add(line));
              return newLines;
            });
            setGuessedStationNames((prev) => [...prev, guess.name]);
            setFilteredStations([]);
            setSearch("");

            return [...prevGuesses, guess];
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu, search, filteredStations]);

  return (
    <div className="keyboard">
      <div className="row">
        {row1.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            search={search}
            setSearch={setSearch}
            filteredStations={filteredStations}
            normalize={normalize}
          />
        ))}
      </div>
      <div className="row">
        {row2.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            search={search}
            setSearch={setSearch}
            filteredStations={filteredStations}
            normalize={normalize}
          />
        ))}
      </div>
      <div className="row">
        <button
          className={`non-letter-button ${
            filteredStations.length === 1 ? "clickable" : ""
          }`}
          onClick={() => {
            if (filteredStations.length === 1) {
              makeGuess();
            }
          }}
        >
          INTRODUCIR
        </button>
        {row3.map((letter) => (
          <Key
            key={letter}
            letter={letter}
            search={search}
            setSearch={setSearch}
            filteredStations={filteredStations}
            normalize={normalize}
          />
        ))}
        <button
          className={`non-letter-button ${
            search.length > 0 ? "clickable" : ""
          }`}
          onClick={() => setSearch(search.substring(0, search.length - 1))}
        >
          <img className="delete-symbol" src={deleteSymbol}></img>
        </button>
      </div>
    </div>
  );
};
