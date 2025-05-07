const { getGameStats } = require("../../frontend/src/services/games");
const User = require("../models/user");

// this needs to return the id of the newly created game to be used in the makeGuess function
async function startGame(req, res) {
  try {
  } catch (err) {}
}

async function getGameStats(req, res) {
  try {
  } catch (err) {}
}
// function to update stats once user's completed a game
async function makeGuess(req, res) {
  try {
  } catch (err) {}
}

const GamesController = {
  startGame: startGame,
  getGameStats: getGameStats,
  makeGuess: makeGuess,
};

module.exports = GamesController;
