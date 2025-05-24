const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.createUser);
router.get("/", UsersController.getUser);
router.patch("/update", UsersController.updateUser);
router.patch("/guess", UsersController.makeGuess);

module.exports = router;
