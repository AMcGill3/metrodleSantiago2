const User = require("../models/user");

async function createUser(req, res) {
  const generateUsername = () => {
    let string = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 15; i++) {
      const randomInd = Math.floor(Math.random() * characters.length);
      string += characters.charAt(randomInd);
    }
    return string;
  };

  try {
    let username;
    let isTaken;

    do {
      username = generateUsername();
      isTaken = await User.findOne({ username });
    } while (isTaken);
    console.log("new user: ", username)

    const user = new User({
      username: username,
    });
    await user.save();

    res.status(201).json({ username: user.username });
  } catch (err) {
    console.error("Error caught:", err);

    // other errors
    return res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const foundUser = await User.findOne({ _id: req.userId });
    res.status(200).json({
      winningStreak: foundUser.winningStreak,
      gamesPlayed: foundUser.gamesPlayed,
      avgGuesses: foundUser.avgGuesses,
      winsInXGuesses: foundUser.winsInXGuesses,
    });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
}
// function to update stats once user's completed a game
async function updateUser(req, res) {
  try {
    const foundUser = await User.findOne({ _id: req.userId });
    res.status(200).json({
      winningStreak: foundUser.winningStreak,
      gamesPlayed: foundUser.gamesPlayed,
      avgGuesses: foundUser.avgGuesses,
      winsIn1: foundUser.winsIn1,
      winsIn2: foundUser.winsIn2,
      winsIn3: foundUser.winsIn3,
      winsIn4: foundUser.winsIn4,
      winsIn5: foundUser.winsIn5,
      winsIn6: foundUser.winsIn6,
    });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
}

const UsersController = {
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
};

module.exports = UsersController;
