import "./Keyboard.css";
import { Key } from "./Key";
import deleteSymbol from "../../assets/deleteSymbol.png";
export const Keyboard = () => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <div className="keyboard">
      <div className="row">
        {row1.map((letter) => (
          <Key key={letter} letter={letter} />
        ))}
      </div>
      <div className="row">
        {row2.map((letter) => (
          <Key key={letter} letter={letter} />
        ))}
      </div>
      <div className="row">
        <button className="non-letter-button">INTRODUCIR</button>
        {row3.map((letter) => (
          <Key key={letter} letter={letter} />
        ))}
        <button className="non-letter-button">
          <img src={deleteSymbol}></img>
        </button>
      </div>
    </div>
  );
};
