import "./Countdown.css";
import { useEffect, useState } from "react";

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
    if (compareLastPlayed()) {
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
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = tomorrow.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("Hoy");
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Optionally pad numbers for 2-digit format
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
