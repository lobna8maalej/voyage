import express from "express";
import { register, login, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.put("/users/:id", updateUser);

export default router;