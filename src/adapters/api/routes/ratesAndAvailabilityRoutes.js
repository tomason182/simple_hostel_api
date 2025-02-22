import express from "express";
import { checkSchema } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  ratesAndAvailabilitySchema,
  checkAvailabilitySchema,
} from "../schemas/ratesAndAvailabilitySchema.js";

export function createRatesAndAvailabilityRoutes(service) {
  const router = express.Router();
  const tokenService = createTokenService();

  const ratesAndAvailabilityController = service.ratesAndAvailabilityController;

  // @desc Add a new rate and availability range
  // @route POST /api/v2/rates_availability/create/:id
  // @access Private
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(ratesAndAvailabilitySchema),
    ratesAndAvailabilityController.createNewRange
  );

  // @desc Check Availability
  // @route POST /api/v2/rates_availability/check
  // @access Private
  router.post(
    "/check-availability",
    authMiddleware(tokenService),
    checkSchema(checkAvailabilitySchema),
    ratesAndAvailabilityController.checkAvailability
  );

  return router;
}
