import cron from "node-cron";
import Station from "../models/station.js";
import TargetStation from "../models/targetStation.js";

const CRON_TZ = "America/Santiago";
export async function setTargetStation() {
  try {
    const currentTarget = await TargetStation.findOne({});
    const currentStationId = currentTarget?.value;

    const stations = await Station.find({ _id: { $ne: currentStationId } });

    const randomStation = stations[Math.floor(Math.random() * stations.length)];

    const updatedDoc = await TargetStation.findOneAndUpdate(
      {},
      {
        value: randomStation._id,
        $inc: { number: 1 },
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
  } catch (err) {
    console.error("[CRON] Failed to update target station & puzzle number:", err);
  }
}


export default function startTargetStationJob() {
  cron.schedule("0 0 * * *", setTargetStation, {
    timezone: CRON_TZ,
  });

  console.log("[CRON] Target station job scheduled for midnight daily.");
}
