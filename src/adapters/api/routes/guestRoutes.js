import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { guestSchema } from "../schemas/guestSchema.js";

export function createGuestRoutes(services) {
  const router = express.Router();
  const tokenService = createTokenService();

  const guestController = services.guestController;

  // @desc    Create a new Guest
  // @route   POST /api/v1/guests/create
  // @access  Private
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(guestSchema),
    guestController.createGuest
  );

  return router;
}
