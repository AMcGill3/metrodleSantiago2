import "./Keyboard.css";
import { Key } from "./Key";
import deleteSymbol from "../../assets/deleteSymbol.png";
import { useEffect } from "react";
import { makeGuess } from "../../services/users.js";

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
  user,
  guessedStationNames
}) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const handleGuess = () => {
    const guess = filteredStations[0];
    makeGuess(user?.username, guess);
    setGuesses((prevGuesses) => {
      setGuessedLines((prevLines) => {
        const newLines = new Set(prevLines);
        guess.lines.forEach((line) => newLines.add(line));
        return newLines;
      });
      setGuessedStationNames((prev) => [...prev, normalize(guess.name)]);
      setFilteredStations([]);
      setSearch("");

      return [...prevGuesses, guess];
    });
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (showMenu === false && user?.lastPlayed !== today) {
        if (/^[a-zA-ZñÑ]$/.test(e.key) && !e.metaKey && !e.shiftKey) {
          setSearch(search + e.key);
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          setSearch(search.substring(0, search.length - 1));
        }
        if (e.key === "Enter" && !e.shiftKey && filteredStations.length === 1 && !guessedStationNames.includes(normalize(filteredStations[0].name))) {
          handleGuess();
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
          data-testid={`non-letter-button${
            filteredStations.length === 1 ? "-clickable" : ""
          }`}
          alt={"Introducir"}
          onClick={() => {
            if (filteredStations.length === 1 && filteredStations.length === 1 && !guessedStationNames.includes(normalize(filteredStations[0].name))) {
              handleGuess();
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
          data-testid={`non-letter-button${
            filteredStations.length === 1 ? "-clickable" : ""
          }`}
          alt={"Tecla de retoceso"}
          onClick={() => setSearch(search.substring(0, search.length - 1))}
        >
          <img
            className="delete-symbol"
            data-testid="delete-symbol"
            src={deleteSymbol}
          ></img>
        </button>
      </div>
    </div>
  );
};
