const User = require("../models/user");
const mongoose = require("mongoose");

const { normalize } = require("../../frontend/src/App/normalize");

async function createUser(req, res) {
  try {
    const user = new User();
    await user.save();

    res.status(201).json({ username: user._id.toString() });
  } catch (err) {
    console.error("Error caught:", err);

    return res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const foundUser = await User.findOne({ _id: new mongoose.Types.ObjectId(req.username) });
    res.status(200).json({
      winningStreak: foundUser.winningStreak,
      gamesPlayed: foundUser.gamesPlayed,
      avgGuesses: foundUser.avgGuesses,
      winsInXGuesses: foundUser.winsInXGuesses,
      lastPlayed: foundUser.lastPlayed,
      game: foundUser.game,
    });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
}
// function to update stats once user's completed a game
async function updateUser(req, res) {
  try {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.username) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toDateString();
    user.lastPlayed = today
  } catch (err) {
    return res.status(400).json({ message: "Could not update user" });
  }
}

async function makeGuess(req, res) {
  try {
    const { guess } = req.body;
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.username) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.game.guesses.push(guess);

    user.game.guessedStationNames.push(guess.name);

    user.game.guessedLines = [
      ...new Set([...user.game.guessedLines, ...guess.lines]),
    ];

    await user.save();

    return res.status(200).json({ message: "Guess recorded" });
  } catch (err) {
    console.error("makeGuess error:", err);
    return res.status(400).json({ message: "Could not process guess" });
  }
}

const UsersController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  makeGuess: makeGuess,
};

module.exports = UsersController;
