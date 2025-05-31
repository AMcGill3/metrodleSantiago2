import mongoose from "mongoose"

const StationSchema = new mongoose.Schema({
  name: String,
  lines: Array,
  coordinates: Array,
});
const Station = mongoose.model("Station", StationSchema);
export default Station;

