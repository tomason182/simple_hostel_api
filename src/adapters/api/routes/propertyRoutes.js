import express from "express";
import { checkSchema } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  contactDetailsSchema,
  propertySchema,
} from "../schemas/propertySchema.js";

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

  // Update property contact info
  router.put(
    "/update/contact-info",
    checkSchema(contactDetailsSchema),
    authMiddleware(tokenService),
    propertyController.updateContactInfo
  );

  return router;
}
