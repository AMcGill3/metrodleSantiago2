import cron from "node-cron";
import User from "../models/user.js";

export default function startClearGameJob() {
  const CRON_TZ = "America/Santiago";
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        await User.updateMany(
          {},
          {
            $set: {
              "game.guesses": [],
              "game.guessedLines": [],
              "game.guessedStationNames": [],
            },
          }
        );

        console.log("[CRON] Game fields reset.");
      } catch (err) {
        console.error("[CRON] Failed to clear game data:", err);
      }
    },
    {
      timezone: CRON_TZ,
    }
  );

  console.log("[CRON] Game clearing job scheduled for midnight daily.");
}
