import request from "supertest";
import app from "../../app.js";
import User from "../../models/user.js";
import { DateTime } from "luxon";

beforeEach(async () => {
  await User.deleteMany({});
});

describe("/users", () => {
  describe("POST, when a user visits the site for the first time", () => {
    test("the response code is 201 and username returned", async () => {
      const response = await request(app).post("/users");

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("username");
      expect(typeof response.body.username).toBe("string");
      expect(response.body.username).not.toBe("");
    });

    test("a user is created correctly", async () => {
      await request(app).post("/users");

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.streak).toEqual(0);
      expect(newUser.gamesPlayed).toEqual(0);
      expect(newUser.maxStreak).toEqual(0);
      expect(newUser.winsInXGuesses["1"]).toEqual(0);
      expect(newUser.winsInXGuesses["2"]).toEqual(0);
      expect(newUser.winsInXGuesses["3"]).toEqual(0);
      expect(newUser.winsInXGuesses["4"]).toEqual(0);
      expect(newUser.winsInXGuesses["5"]).toEqual(0);
      expect(newUser.winsInXGuesses["6"]).toEqual(0);
      expect(newUser.game.guessedLines).toEqual([]);
      expect(newUser.game.guessedStationNames).toEqual([]);
      expect(newUser.game.guesses).toEqual([]);
      expect(newUser.lastPlayed).toBeUndefined();
    });
  });

  describe("GET, when existing user returns and hasn't started game yet", () => {
    let user;

    beforeEach(async () => {
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
      });
      await user.save();
    });
    test("response code is 200", async () => {
      const response = await request(app)
        .get("/users")
        .query({ username: user._id.toString() });

      expect(response.statusCode).toBe(200);
    });

    test("user data returned", async () => {
      const response = await request(app)
        .get("/users")
        .query({ username: user._id.toString() });
      expect(response.body.streak).toEqual(1);
      expect(response.body.gamesPlayed).toEqual(1);
      expect(response.body.maxStreak).toEqual(1);
      expect(response.body.winsInXGuesses).toEqual({
        1: 1,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      });
    });
  });
  describe("PATCH requests", () => {
    let user;

    beforeEach(async () => {
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
          guesses: [],
          guessedStationNames: [],
          guessedLines: [],
        },
      });
      await user.save();
    });
    describe("PATCH, guess", () => {
      test("response code is 200", async () => {
        const response = await request(app)
          .patch("/users/guess")
          .send({
            username: user._id.toString(),
            guess: {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          });

        expect(response.statusCode).toBe(200);
      });

      test("user game object correctly updates", async () => {
        await request(app)
          .patch("/users/guess")
          .send({
            username: user._id.toString(),
            guess: {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          });
        const updatedUser = await User.findById(user._id).lean();
        expect(updatedUser.game).toEqual({
          guessedLines: ["1", "5"],
          guessedStationNames: ["sanpablo"],
          guesses: [
            {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          ],
        });
      });

      test("game data persists when getUser request is made again", async () => {
        await request(app)
          .patch("/users/guess")
          .send({
            username: user._id.toString(),
            guess: {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          });
        const response = await request(app)
          .get("/users")
          .query({ username: user._id.toString() });
        expect(response.body.game).toEqual({
          guessedLines: ["1", "5"],
          guessedStationNames: ["sanpablo"],
          guesses: [
            {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          ],
        });
      });

      test("game arrays are updated rather than replaced when more than 1 guess is made", async () => {
        await request(app)
          .patch("/users/guess")
          .send({
            username: user._id.toString(),
            guess: {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
          });
        await request(app)
          .patch("/users/guess")
          .send({
            username: user._id.toString(),
            guess: {
              name: "Ciudad del Niño",
              lines: ["2"],
              coordinates: [840, 1020],
            },
          });

        const updatedUser = await User.findById(user._id).lean();
        expect(updatedUser.game).toEqual({
          guessedLines: ["1", "5", "2"],
          guessedStationNames: ["sanpablo", "ciudaddelniño"],
          guesses: [
            {
              name: "San Pablo",
              lines: ["1", "5"],
              coordinates: [294, 425],
            },
            {
              name: "Ciudad del Niño",
              lines: ["2"],
              coordinates: [840, 1020],
            },
          ],
        });
      });
    });

    describe("PATCH, update", () => {
      describe("game won", () => {
        test("response code is 200", async () => {
          const response = await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: true,
            guessNumber: 2,
          });

          expect(response.statusCode).toBe(200);
        });
        test("streak and max streak updated to 1 for first time user", async () => {
          user.streak = 0;
          user.gamesPlayed = 0;
          user.maxStreak = 0;
          user.winsInXGuesses["1"] = 0;
          await user.save();
          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: true,
            guessNumber: 3,
          });
          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.streak).toBe(1);
          expect(updatedUser.maxStreak).toBe(1);
        });
        test("streak resets to 1 if lastPlayed was more than 1 day ago and max streak unchanged", async () => {
          const threeDaysAgo = DateTime.now()
            .setZone("America/Santiago")
            .minus({ days: 3 })
            .startOf("day")
            .toJSDate();

          user.lastPlayed = threeDaysAgo;
          user.streak = 5;
          user.maxStreak = 5;
          await user.save();

          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: true,
            guessNumber: 3,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.streak).toBe(1);
          expect(updatedUser.maxStreak).toBe(5);
        });
        test("streak and max streak correctly incremented if last played was yesterday", async () => {
          const yesterday = DateTime.now()
            .setZone("America/Santiago")
            .minus({ days: 1 })
            .startOf("day")
            .toJSDate();

          user.lastPlayed = yesterday;
          await user.save();

          const today = new Date().toISOString();

          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today,
            win: true,
            guessNumber: 2,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.streak).toBe(2);
          expect(updatedUser.maxStreak).toBe(2);
        });
        test("Wins in x guesses correctly updated", async () => {
          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: true,
            guessNumber: 1,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.winsInXGuesses["1"]).toBe(2);
        });
        test("gamesPlayed incremented", async () => {
          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: true,
            guessNumber: 2,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.gamesPlayed).toBe(2);
        });
        test("last played set to current day", async () => {
          const today = new Date();
          const isoDate = today.toISOString();
          const dateOnly = isoDate.slice(0, 10);

          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: isoDate,
            win: true,
            guessNumber: 2,
          });

          const updatedUser = await User.findById(user._id).lean();
          const updatedDate = new Date(updatedUser.lastPlayed)
            .toISOString()
            .slice(0, 10);
          expect(updatedDate).toBe(dateOnly);
        });
      });
      describe("game lost", () => {
        test("response code is 200 even when game is lost", async () => {
          const response = await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: false,
          });

          expect(response.statusCode).toBe(200);
        });
        test("streak reset to 0", async () => {
          user.streak = 3;
          await user.save();

          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: false,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.streak).toBe(0);
        });
        test("last played set to current day even when game lost", async () => {
          const isoDate = new Date().toISOString();
          const today = isoDate.slice(0, 10);

          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: isoDate,
            win: false,
          });

          const updatedUser = await User.findById(user._id).lean();
          const updated = new Date(updatedUser.lastPlayed)
            .toISOString()
            .slice(0, 10);
          expect(updated).toBe(today);
        });
        test("gamesPlayed incremented even when game lost", async () => {
          await request(app).patch("/users/update").send({
            user: user._id.toString(),
            today: new Date().toISOString(),
            win: false,
          });

          const updatedUser = await User.findById(user._id).lean();
          expect(updatedUser.gamesPlayed).toBe(2);
        });
      });
    });
  });
});
