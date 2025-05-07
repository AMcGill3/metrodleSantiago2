const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
  name: String,
  lines: Array,
  coordinates: Array,
});

const Station = mongoose.model("Station", StationSchema);

module.exports = Station;
