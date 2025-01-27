import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import { propertySchema } from "../schemas/propertySchema.js";

export function createPropertyRoutes(services) {
  const router = express.Router();
  const tokenService = createTokenService();

  const propertyController = services.propertyController;

  // Get property details
  router.get(
    "/",
    authMiddleware(tokenService),
    propertyController.getPropertyDetails
  );

  // Update property details
  router.put(
    "/update",
    authMiddleware(tokenService),
    checkSchema(propertySchema),
    propertyController.updatePropertyDetails
  );

  return router;
}
