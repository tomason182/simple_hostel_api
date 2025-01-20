import express from "express";
import * as userController from "../controllers/userController.js";

export const router = express.Router();

// Register new user
router.post("/register", userController.userRegister);
