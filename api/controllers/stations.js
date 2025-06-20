import TargetStation from "../models/targetStation.js";

async function getTargetStation(req, res) {
  try {
    const target = await TargetStation.findOne({ key: "targetStation"}).populate("value");
    res.status(200).json({ station: target.value, number: target.number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const StationsController = {
  getTargetStation: getTargetStation
};

export default StationsController;