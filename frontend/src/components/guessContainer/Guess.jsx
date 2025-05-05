import "./Guess.css";
import circleMap from "../../utils/loadLineCircleSVGs";
// import arrowMap from "../../utils/loadArrowSVGs";

export const Guess = ({ guessed, name, lines }) => {
  return (
    <div className={`guess-card ${guessed ? "guessed" : "not-guessed"}`}>
      <div className="station-name">{name}</div>
      {guessed === true && (
        <div className="lines">
          {lines.map((line) => {
            const circle = circleMap[`circle${line}`];
            return (
              <img
                className="circle"
                key={line}
                src={circle}
                alt={`Line ${line}`}
              />
            );
          })}
        </div>
      )}
      <div className="stops-away"></div>
      <div className="arrow"></div>
    </div>
  );
};
