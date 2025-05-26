const cron = require("node-cron");
const User = require("../models/user");

function startClearGameJob() {
  CRON_TZ = "America/Santiago";
  cron.schedule("0 0 * * *", async () => {
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
  });

  console.log("[CRON] Game clearing job scheduled for midnight daily.");
}

module.exports = startClearGameJob;
