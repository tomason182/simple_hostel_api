import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { reservationSchema } from "../schemas/reservationSchema.js";

export function createReservationRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();
  const reservationController = services.reservationController;

  // @desc Create a new reservation
  // @route POST /api/v1/reservations/new
  // @access Private
  router.post(
    "/new",
    authMiddleware(tokenService),
    checkSchema(reservationSchema),
    reservationController.createReservation
  );
}
