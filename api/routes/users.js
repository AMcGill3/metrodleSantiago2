import express from "express"

import UsersController from "../controllers/users.js";

const router = express.Router();

router.post("/", UsersController.createUser);
router.get("/", UsersController.getUser);
router.patch("/update", UsersController.updateUser);
router.patch("/guess", UsersController.makeGuess);

export default router;
