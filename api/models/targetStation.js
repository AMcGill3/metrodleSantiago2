import mongoose from "mongoose"

const targetStationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
  updatedAt: { type: Date, default: Date.now }
});

const TargetStation = mongoose.model("TargetStation", targetStationSchema);

export default TargetStation;