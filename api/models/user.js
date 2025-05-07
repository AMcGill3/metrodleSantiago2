const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  winningStreak: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  avgGuesses: { type: Number, default: 0 },
  winsInXGuesses: {
    type: Object,
    default: () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }),
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
