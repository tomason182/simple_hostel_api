import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../schemas/userSchema.js";

export function createUserRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  // Register new user
  router.post(
    "/register",
    checkSchema(userRegistrationSchema),
    body("propertyName")
      .trim()
      .escape()
      .isLength({ min: 1, max: 255 })
      .withMessage("Property name maximum length is 255 characters"),
    body("acceptTerms").isBoolean().withMessage("Accept terms must be boolean"),
    body("captchaToken").trim().escape(),
    services.userController.userRegister
  );

  // Confirm email
  router.post(
    "/confirm-email/:token",
    param("token").isJWT().withMessage("Invalid JWT token"),
    services.userController.finishUserRegister
  );

  // Resend email
  router.post(
    "/resend-email-verification",
    body("email").trim().isEmail().withMessage("Not a valid email address"),
    services.userController.resendEmailVerification
  );

  // Create a new user to an existing property
  router.post(
    "/create",
    authMiddleware(tokenService),
    checkSchema(userRegistrationSchema),
    body("role")
      .trim()
      .isIn(["admin", "manager", "employee"])
      .withMessage(
        "Role must be one of the following: admin, manager, employee"
      ),
    services.userController.createUser
  );

  // Authenticate a user
  router.post(
    "/auth",
    checkSchema(userLoginSchema),
    services.userController.authUser
  );

  // Validate a user
  // Esta ruta creo que esta al pedo. Se valida con el authmiddelware.
  router.get("/validate", services.userController.validateUser);

  // logout a user
  router.get("/logout", services.userController.logoutUser);

  return router;
}
