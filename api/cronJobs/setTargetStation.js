import cron from "node-cron";
import Station from "../models/station.js";
import targetStation from "../models/targetStation.js";

export default function startTargetStationJob() {
  const CRON_TZ = "America/Santiago";
  cron.schedule("0 0 * * *", async () => {
    try {
      const [randomStation] = await Station.aggregate([
        { $sample: { size: 1 } },
      ]);
      if (randomStation) {
        await targetStation.findOneAndUpdate(
          { key: "targetStation" },
          { value: randomStation._id, updatedAt: new Date() },
          { upsert: true }
        );
        console.log(`[CRON] New target station set: ${randomStation.name}`);
      }
    } catch (err) {
      console.error("[CRON] Failed to set target station:", err);
    }
  },
{
  timezone: CRON_TZ
});

  console.log("[CRON] Target station job scheduled.");
}

