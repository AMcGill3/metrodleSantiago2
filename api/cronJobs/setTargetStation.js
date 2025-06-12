import cron from "node-cron";
import Station from "../models/station.js";
import TargetStation from "../models/targetStation.js";

export default function startCombinedTargetStationJob() {
  const CRON_TZ = "America/Santiago";

  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const [randomStation] = await Station.aggregate([
          { $sample: { size: 1 } },
        ]);

        if (randomStation) {
          const updatedDoc = await TargetStation.findOneAndUpdate(
            {},
            {
              value: randomStation._id,
              $inc: { number: 1 },
              updatedAt: new Date(),
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );

          console.log(
            `[CRON] Target station set to "${randomStation.name}", puzzle number is now ${updatedDoc.number}`
          );
        }
      } catch (err) {
        console.error("[CRON] Failed to update target station & puzzle number:", err);
      }
    },
    {
      timezone: CRON_TZ,
    }
  );

  console.log("[CRON] Combined target station + puzzle number job scheduled.");
}
