import express from "express";
import { checkSchema } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";
import { breakfastSchema } from "../schemas/breakfastAndMealsSchema.js";

export function createBreakfastAndMealsRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const breakfastAndMealsController = services.breakfastAndMealsController;

  // Get breakfast settings
  router.get(
    "/breakfast",
    authMiddleware(tokenService),
    breakfastAndMealsController.getBreakfastSettings
  );

  // Update breakfast settings
  router.post(
    "/breakfast",
    authMiddleware(tokenService),
    checkPermission("update_breakfast"),
    checkSchema(breakfastSchema),
    breakfastAndMealsController.updateBreakfastSettings
  );

  return router;
}
