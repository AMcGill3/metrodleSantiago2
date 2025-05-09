const express = require("express");
const router = express.Router();

const GamesController = require("../controllers/games");

router.get("/", GamesController.getGameStats);
router.post("/", GamesController.startGame);
router.put("/", GamesController.makeGuess);

module.exports = router;
