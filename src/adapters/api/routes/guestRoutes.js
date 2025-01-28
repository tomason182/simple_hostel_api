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

  // @desc    Update an specific guest
  // @route   PUT /api/v1/guests/update/:id
  // @access  Private
  router.put(
    "/update/:id",
    param("id").trim().isInt().withMessage("Invalid ID parameter"),
    authMiddleware(tokenService),
    checkSchema(guestSchema),
    guestController.updateGuest
  );

  return router;
}
