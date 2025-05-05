const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user: String,
  winningStreak: Number,
  gamesPlayed: Number,
  avgGuesses: Number,
  winsIn1: Number,
  winsIn2: Number,
  winsIn3: Number,
  winsIn4: Number,
  winsIn5: Number,
  winsIn6: Number,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
