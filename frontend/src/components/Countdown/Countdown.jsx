import "./Countdown.css";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export const Countdown = ({
  today,
  bfsDistance,
  nameToId,
  guesses,
  graph,
  compareLastPlayed,
}) => {
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTotalJourney = () => {
    if (compareLastPlayed) {
      let totalJourney = 0;
      for (let i = 0; i < guesses?.length - 1; i++) {
        const diff = bfsDistance(
          graph,
          nameToId[guesses[i].name],
          nameToId[guesses[i + 1].name]
        );
        totalJourney += diff;
      }

      return totalJourney > 1 ? totalJourney : 1;
    } else {
      return;
    }
  };

  useEffect(() => {
    const tomorrow = DateTime.now()
      .setZone("America/Santiago")
      .plus({ days: 1 })
      .startOf("day");

    const timer = setInterval(() => {
      const now = DateTime.now();
      const distance = tomorrow.diff(now, "seconds").seconds;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("Hoy");
      } else {
        const hours = Math.floor(distance / 3600);
        const minutes = Math.floor((distance % 3600) / 60);
        const seconds = Math.floor(distance % 60);

        const pad = (n) => (n < 10 ? "0" + n : n);
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [today]);

  return (
    <>
      <div className="left-countdown">
        <p>Viaje Total</p>
        <p>{calculateTotalJourney()}</p>
      </div>
      <div className="right-countdown">
        <p>El Próximo Metrodle llegará en</p>
        <p>{timeLeft}</p>
      </div>
    </>
  );
};
