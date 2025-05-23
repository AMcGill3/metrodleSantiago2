// docs: https://github.com/motdotla/dotenv#%EF%B8%8F-usage
require("dotenv").config();
const startTargetStationJob = require('./cronJobs/setTargetStation');
const startClearGameJob = require("./cronJobs/clearGame")

const app = require("./app.js");
const { connectToDatabase } = require("./db/db.js");


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
