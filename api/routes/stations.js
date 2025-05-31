import express from "express"
const router = express.Router();
import StationsController from "../controllers/stations.js"

router.get("/", StationsController.getTargetStation);

export default router;
