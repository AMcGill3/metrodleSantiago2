import dotenv from "dotenv";
dotenv.config();

import startTargetStationJob from "./cronJobs/setTargetStation.js";
import startClearGameJob from "./cronJobs/clearGame.js";

import app from "./app.js";
import { connectToDatabase } from "./db/db.js";

function listenForRequests() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("Now listening on port", port);
  });
}

connectToDatabase().then(() => {
  startTargetStationJob();
  startClearGameJob();
  listenForRequests();
});