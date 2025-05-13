import "./Keyboard.css";
import { Key } from "./Key";
import deleteSymbol from "../../assets/deleteSymbol.png";
export const Keyboard = ({ search, setSearch, filteredStations, makeGuess, normalize }) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

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
          className="non-letter-button"
          onClick={() => {if (
            filteredStations.length === 1
          ) {
            makeGuess();
          }}}
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
        <button className="non-letter-button"
          onClick={() => setSearch(search.substring(0, search.length - 1))}>
          <img className="delete-symbol" src={deleteSymbol}></img>
        </button>
      </div>
    </div>
  );
};
