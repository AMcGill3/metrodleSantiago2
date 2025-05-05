const Station = require("../models/station");

async function getAllStations(req, res) {
  const stations = await Station.find();
  res.status(200).json({ stations: stations });
}

const PostsController = {
  getAllStations: getAllStations
};

module.exports = StationsController;
