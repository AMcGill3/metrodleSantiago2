const mongoose = require('mongoose');

const targetStationSchema = new mongoose.Schema({
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
});

const targetStation = mongoose.model("TargetStation", targetStationSchema);

module.exports = targetStation