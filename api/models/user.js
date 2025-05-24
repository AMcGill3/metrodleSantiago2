const mongoose = require("mongoose");

const GuessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lines: { type: [String], default: [] },
    coordinates: { type: [Number], default: [] }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  lastPlayed: { type: Date },
  winningStreak: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  avgGuesses: { type: Number, default: 0 },
  winsInXGuesses: {
    type: Object,
    default: () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }),
  },
  game: {
    guesses: { type: [GuessSchema], default: [] },
    guessedLines: { type: [String], default: [] },
    guessedStationNames: { type: [String], default: [] },
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
