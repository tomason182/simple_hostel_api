import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  userChangePassSchema,
  usernameSchema,
  userResetPassSchema,
} from "../schemas/userSchema.js";

export function createUserRoutes(services) {
  const router = express.Router();

  const tokenService = createTokenService();

  const userController = services.userController;

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
    userController.userRegister
  );

  // Confirm email
  router.post(
    "/confirm-email/:token",
    param("token").isJWT().withMessage("Invalid JWT token"),
    userController.finishUserRegister
  );

  // Resend email
  router.post(
    "/resend-email-verification",
    body("email").trim().isEmail().withMessage("Not a valid email address"),
    userController.resendEmailVerification
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
    userController.createUser
  );

  // Authenticate a user
  router.post("/auth", checkSchema(userLoginSchema), userController.authUser);

  // Validate a user
  // Esta ruta creo que esta al pedo. Se valida con el authmiddelware.
  //router.get("/validate", userController.validateUser);

  // logout a user
  router.get("/logout", userController.logoutUser);

  // Get user profile
  router.get(
    "/profile",
    authMiddleware(tokenService),
    userController.getUserProfile
  );

  // update user profile
  router.put(
    "/profile/",
    authMiddleware(tokenService),
    checkSchema(userUpdateSchema),
    userController.updateUserProfile
  );

  // Edit user profile
  router.put(
    "/profile/edit/:id",
    authMiddleware(tokenService),
    checkSchema(userUpdateSchema),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    userController.editUserProfile
  );

  // Delete user profile
  router.delete(
    "/profile/delete/:id",
    authMiddleware(tokenService),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    userController.deleteUserProfile
  );

  // Delete account
  router.delete(
    "/accounts/delete/",
    authMiddleware(tokenService),
    userController.deleteUserAccount
  );

  // Update user password
  router.put(
    "/profile/change-pass/",
    authMiddleware(tokenService),
    checkSchema(userChangePassSchema),
    userController.updateUserPassword
  );

  // Reset password
  router.post(
    "/reset-password/init-change-pass",
    checkSchema(usernameSchema),
    userController.resetUserPassword
  );

  router.put(
    "/reset-password/finish-change-pass/:token",
    param("token").isJWT().withMessage("Invalid JWT token"),
    checkSchema(userResetPassSchema),
    userController.resetUserPasswordLastStep
  );

  // @desc get all property users
  router.get(
    "/all",
    authMiddleware(tokenService),
    userController.getAllPropertyUsers
  );

  return router;
}
