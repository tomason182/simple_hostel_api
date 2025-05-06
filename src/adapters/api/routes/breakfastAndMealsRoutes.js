import express from "express";
import { checkSchema } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { breakfastSchema } from "../schemas/breakfastSchemaAndMealsSchema.js";

export function createBreakfastAndMealsRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const breakfastAndMealsController = services.breakfastAndMealsController;

  // Get breakfast settings
  router.get(
    "/breakfast-and-meals/breakfast",
    authMiddleware(tokenService),
    breakfastAndMealsController.getBreakfastSettings
  );

  // Update breakfast settings
  router.post(
    "/breakfast-and-meals/breakfast",
    authMiddleware(tokenService),
    checkSchema(breakfastSchema),
    breakfastAndMealsController.updateBreakfastSettings
  );
}
