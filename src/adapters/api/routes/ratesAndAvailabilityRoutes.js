import express from "express";
import { checkSchema } from "express-validator";
import { createTokenService } from "../../config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { ratesAndAvailabilitySchema } from "../schemas/ratesAndAvailabilitySchema.js";

export function createRatesAndAvailabilityRoutes(service) {
  const router = express.Router();
  const tokenService = createTokenService();

  const rateAndAvailabilityController = service.ratesAndAvailabilityController;

  // @desc Add a new rate and availability range
  // @route POST /api/v1/rates_availability/create/:id
  // @access Private
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(ratesAndAvailabilitySchema),
    rateAndAvailabilityController.createNewRange
  );

  return router;
}
