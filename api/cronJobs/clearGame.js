import cron from "node-cron";
import User from "../models/user.js";

const CRON_TZ = "America/Santiago";

export async function clearGames() {
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
}

export default function startClearGameJob() {
  cron.schedule("0 0 * * *", clearGames, {
    timezone: CRON_TZ,
  });

  console.log("[CRON] Game clearing job scheduled for midnight daily.");
}
