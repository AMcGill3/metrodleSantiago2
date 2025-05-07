const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
  userId: String,
  gameDate: { type: Date, required: true },
  guessedStations: [String],
  guessedLines: [String],
  completed: Boolean
});

gameSchema.index({ userId: 1, gameDate: 1 });

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const todaysGame = await Game.findOne({
  userId: currentUserId,
  gameDate: { $gte: startOfToday, $lte: endOfToday }
});