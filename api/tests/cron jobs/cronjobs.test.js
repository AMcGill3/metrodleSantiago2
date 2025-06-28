import { clearGames } from "../../cronJobs/clearGame.js";
import startTargetStationJob, {
  setTargetStation,
} from "../../cronJobs/setTargetStation.js";
import User from "../../models/user.js";
import TargetStation from "../../models/targetStation.js";
import Station from "../../models/station.js";
import { DateTime } from "luxon";

beforeEach(async () => {
  await User.deleteMany({});
  await TargetStation.deleteMany({});
  await Station.deleteMany({});
});

describe("Clear game job", () => {
  let user;
  beforeEach(async () => {
    const threeDaysAgo = DateTime.now()
      .setZone("America/Santiago")
      .minus({ days: 3 })
      .startOf("day")
      .toJSDate();

    user = new User({
      streak: 1,
      gamesPlayed: 1,
      maxStreak: 1,
      winsInXGuesses: {
        1: 1,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      },
      game: {
        guesses: [
          {
            name: "San Pablo",
            lines: ["1", "5"],
            coordinates: [294, 425],
          },
          {
            name: "Plaza de Puente Alto",
            lines: ["4"],
            coordinates: [1317.5, 1630],
          },
        ],
        guessedLines: ["1", "5", "4"],
        guessedStationNames: ["sanpablo", "plazadepuentealto"],
      },
      lastPlayed: threeDaysAgo,
    });
    await user.save();
  });
  test("game object reset", async () => {
    await clearGames();
    const updatedUser = await User.findById(user._id).lean();
    expect(updatedUser.game.guesses).toEqual([]);
    expect(updatedUser.game.guessedLines).toEqual([]);
    expect(updatedUser.game.guessedStationNames).toEqual([]);
  });
  test("user model that isn't game object unchanged", async () => {
    const threeDaysAgo = DateTime.now()
      .setZone("America/Santiago")
      .minus({ days: 3 })
      .startOf("day")
      .toJSDate();
    await clearGames();
    const updatedUser = await User.findById(user._id).lean();
    expect(updatedUser.streak).toEqual(1);
    expect(updatedUser.maxStreak).toEqual(1);
    expect(updatedUser.gamesPlayed).toEqual(1);
    expect(updatedUser.lastPlayed).toEqual(threeDaysAgo);
    expect(updatedUser.winsInXGuesses["1"]).toEqual(1);
    expect(updatedUser.winsInXGuesses["2"]).toEqual(0);
    expect(updatedUser.winsInXGuesses["3"]).toEqual(0);
    expect(updatedUser.winsInXGuesses["4"]).toEqual(0);
    expect(updatedUser.winsInXGuesses["5"]).toEqual(0);
    expect(updatedUser.winsInXGuesses["6"]).toEqual(0);
  });
});

describe("Change target station job", () => {
  let station1, station2, station3, station4;
  beforeEach(async () => {
    station1 = await Station.create({
      name: "San Pablo",
      lines: ["1", "5"],
      coordinates: [294, 425],
    });
    station2 = await Station.create({
      name: "Alcántara",
      lines: ["1"],
      coordinates: [1217, 298],
    });
    station3 = await Station.create({
      name: "Observatorio",
      lines: ["2"],
      coordinates: [840.5, 134.5],
    });
    station4 = await Station.create({
      name: "Simón Bolívar",
      lines: ["4"],
      coordinates: [1318, 602],
    });
    await TargetStation.create({
      key: "targetStation",
      value: station1._id,
      number: 1,
    });
  });
  test("station object changes", async () => {
    await setTargetStation();
    const updated = await TargetStation.findOne({ key: "targetStation" });
    expect(updated).toBeTruthy();
    expect(updated.value.toString()).not.toEqual(station1._id.toString());
  });
  test("puzzle number incremented", async () => {
    await setTargetStation();
    const updated = await TargetStation.findOne({ key: "targetStation" });
    expect(updated.number).toBe(2);
  });
});
