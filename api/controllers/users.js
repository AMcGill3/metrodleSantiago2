import User from "../models/user.js";
import mongoose from "mongoose"
import { normalize } from "../../normalize.js";

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
    const foundUser = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.query.username),
    });
    res.status(200).json({
      username: foundUser._id,
      game: foundUser.game,
      streak: foundUser.streak,
      gamesPlayed: foundUser.gamesPlayed,
      winsInXGuesses: foundUser.winsInXGuesses,
      lastPlayed: foundUser.lastPlayed,
      maxStreak: foundUser.maxStreak,
    });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
}

async function updateUser(req, res) {
  const dateToday = req.body.today;
  try {
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.body.user),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.gamesPlayed += 1;

    if (req.body.win === true && req.body.guessNumber !== null) {
      user.winsInXGuesses[req.body.guessNumber] += 1;
      user.markModified("winsInXGuesses");

    }
    if (user.lastPlayed) {
      const lastPlayed = new Date(user.lastPlayed);
      lastPlayed.setHours(0, 0, 0, 0);

      const difference = (dateToday - lastPlayed) / 86400000;
      if (difference === 1) {
        if (user.maxStreak === user.streak) {
          user.maxStreak += 1;
        }
        user.streak += 1;
      } else {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
      user.maxStreak = 1;
    }

    user.lastPlayed = dateToday;

    await user.save();
    return res.status(200).json({ message: "user updated" });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Could not update user", error: err.message });
  }
}

async function makeGuess(req, res) {
  try {
    const { guess } = req.body;
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.body.username),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.game.guesses.push(guess);

    user.game.guessedStationNames.push(normalize(guess.name));

    user.game.guessedLines = [
      ...new Set([...user.game.guessedLines, ...guess.lines]),
    ];

    user.markModified("game");

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

export default UsersController;