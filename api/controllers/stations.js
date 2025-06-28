import TargetStation from "../models/targetStation.js";
import Station from "../models/station.js";

async function getTargetStation(req, res) {
  try {
    const target = await TargetStation.findOne({ key: "targetStation"}).populate("value");
    res.status(200).json({ station: target.value, number: target.number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllStations(req, res) {
  try {
    const stations = await Station.find({})
    res.status(200).json({ stations: stations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const StationsController = {
  getTargetStation: getTargetStation,
  getAllStations: getAllStations
};

export default StationsController;