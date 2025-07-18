import express from "express";
import { checkSchema, body, param } from "express-validator";
import { createTokenService } from "../../../adapters/config/tokenConfig.js";
import authMiddleware from "../../../middleware/authMiddleware.js";
import checkPermission from "../../../middleware/rbacMiddleware.js";
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  userChangePassSchema,
  usernameSchema,
  userResetPassSchema,
  userEditSchema,
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
    body("captchaToken")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("captcha needs to be provided"),
    userController.userRegister
  );

  // Confirm email
  router.get(
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
    checkPermission("create_user"),
    checkSchema(userEditSchema),
    body("role")
      .trim()
      .isIn(["admin", "manager", "employee"])
      .withMessage(
        "Role must be one of the following: admin, manager, employee"
      ),
    userController.createOrUpdateUser
  );

  // Validate new user email and set up password.
  router.post(
    "/validate/new-user/:token",
    param("token").isJWT().withMessage("Invalid JWT token"),
    checkSchema(userResetPassSchema),
    userController.finishCreateUser
  );

  // Authenticate a user
  router.post("/auth", checkSchema(userLoginSchema), userController.authUser);

  // logout a user
  router.get("/logout", userController.logoutUser);

  // Get user profile
  router.get(
    "/profile",
    authMiddleware(tokenService),
    userController.getUserProfile
  );

  // update user account
  // Esta ruta es de profile en settings. Para actualizar un usuario se usa la misma que para crearlo.
  router.put(
    "/profile",
    authMiddleware(tokenService),
    checkPermission("update_profile"),
    checkSchema(userUpdateSchema),
    userController.updateUserProfile
  );

  // Delete user profile
  router.delete(
    "/profile/delete/:id",
    authMiddleware(tokenService),
    checkPermission("delete_profile"),
    param("id").trim().isInt().withMessage("Not a valid ID"),
    userController.deleteUserProfile
  );

  // Delete account
  // PARA UN USUARIO NO ADMIN DEBERIA ELIMINAR AL USUARIO
  // PARA ADMIN HAY QUE ESTUDIARLO.
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

  // Upgrade Plan request
  router.get(
    "/upgrade-request",
    authMiddleware(tokenService),
    checkPermission("request-upgrade"),
    userController.requestUpgrade
  );

  return router;
}
