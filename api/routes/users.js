const express = require("express");

const UsersController = require("../controllers/users");

const router = express.Router();

router.post("/", UsersController.createUser);
router.get("/", UsersController.getUser);
router.put("/", UsersController.updateUser);

module.exports = router;
