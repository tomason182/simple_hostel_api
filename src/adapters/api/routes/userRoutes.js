import express from "express";
import * as userController from "../controllers/userController.js";

export const router = express.Router();

// Register new user
router.post("/register", userController.userRegister);

// Confirm email route
router.post("/confirm-email/:token", userController.finishUserRegister);

// Resend email
router.post(
  "resend-email-verification",
  userController.resendEmailVerification
);
