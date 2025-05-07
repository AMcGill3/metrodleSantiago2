const TargetStation = require("../models/station");

async function getTargetStation(req, res) {
  try {
    const target = await TargetStation.findOne().populate('station');
    res.status(200).json({ station: target?.station });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


const StationsController = {
  getTargetStation: getTargetStation
};

module.exports = StationsController;
