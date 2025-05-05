// import { useState, useEffect } from "react";
import { Guess } from "./Guess";
import "./guessContainer.css";

export const GuessContainer = ({ guesses }) => {
  return (
    <div className="guess-container">
      <Guess
        guessed={guesses.length > 0}
        name={guesses.length > 0 ? guesses[0].name : ""}
        lines={guesses.length > 0 ? guesses[0].lines : []}
      ></Guess>
      <Guess
        guessed={guesses.length > 1}
        name={guesses.length > 1 ? guesses[1].name : ""}
        lines={guesses.length > 1 ? guesses[1].lines : []}
      ></Guess>
      <Guess
        guessed={guesses.length > 2}
        name={guesses.length > 2 ? guesses[2].name : ""}
        lines={guesses.length > 2 ? guesses[2].lines : []}
      ></Guess>
      <Guess
        guessed={guesses.length > 3}
        name={guesses.length > 3 ? guesses[3].name : ""}
        lines={guesses.length > 3 ? guesses[3].lines : []}
      ></Guess>
      <Guess
        guessed={guesses.length > 4}
        name={guesses.length > 4 ? guesses[4].name : ""}
        lines={guesses.length > 4 ? guesses[4].lines : []}
      ></Guess>
      <Guess
        guessed={guesses.length > 5}
        name={guesses.length > 5 ? guesses[5].name : ""}
        lines={guesses.length > 5 ? guesses[5].lines : []}
      ></Guess>
    </div>
  );
};
