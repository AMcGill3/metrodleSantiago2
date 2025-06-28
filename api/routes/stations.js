import express from "express"
const router = express.Router();
import StationsController from "../controllers/stations.js"

router.get("/", StationsController.getTargetStation);
router.get("/all", StationsController.getAllStations)
export default router;
