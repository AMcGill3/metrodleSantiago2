// import { useState, useEffect } from "react";
import { Guess } from "./Guess";
import "./guessContainer.css";

export const GuessContainer = ({ guesses, guessedLines, targetStation, stopsFromTarget, theme }) => {
  return (
    <div className="guess-container">
      <Guess
        guessed={guesses.length > 0}
        guess={guesses.length > 0 ? guesses[0] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
      <Guess
        guessed={guesses.length > 1}
        guess={guesses.length > 1 ? guesses[1] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
      <Guess
        guessed={guesses.length > 2}
        guess={guesses.length > 2 ? guesses[2] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
      <Guess
        guessed={guesses.length > 3}
        guess={guesses.length > 3 ? guesses[3] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
      <Guess
        guessed={guesses.length > 4}
        guess={guesses.length > 4 ? guesses[4] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
      <Guess
        guessed={guesses.length > 5}
        guess={guesses.length > 5 ? guesses[5] : null}
        targetStation={targetStation}
        guessedLines={guessedLines}
        stopsFromTarget={stopsFromTarget}
        theme={theme}
        howToPlay={false}
      ></Guess>
    </div>
  );
};
