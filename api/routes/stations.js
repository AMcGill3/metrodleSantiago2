const express = require("express");
const router = express.Router();

const StationsController = require("../controllers/stations");

router.get("/", StationsController.getTargetStation);

module.exports = router;
