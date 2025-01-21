import {
  userRegistrationSchema,
  userLoginSchema,
} from "../schemas/userSchema.js";
import { verifyCaptcha } from "../../../utils/verifyCaptcha.js";
import {
  checkSchema,
  validationResult,
  matchedData,
  body,
  param,
} from "express-validator";

import { services } from "../../../../bin/www";

// @desc    Register a new user
// @route   POST /api/v2/users/register
// @access  Public
export const userRegister = [
  checkSchema(userRegistrationSchema),
  body("propertyName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 255 })
    .withMessage("Property name maximum length is 255 characters"),
  body("acceptTerms").isBoolean().withMessage("Accept terms must be boolean"),
  body("captchaToken").trim().escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      if (!process.env.NEW_USERS) {
        res.status(503);
        throw new Error(
          "User registrations is currently close. Please check back soon!"
        );
      }

      // Extract req values
      const {
        username,
        password,
        firstName,
        propertyName,
        acceptTerms,
        captchaToken,
      } = matchedData(req);

      // Comment accept terms and captcha validation for testing.

      /*       if (acceptTerms !== true) {
            throw new Error(
              "Terms and conditions must be accepted before registration"
            );
          }
    
          isCaptchaTokenValid = await verifyCaptcha(captchaToken);
    
          if (isCaptchaTokenValid === false) {
            throw new Error("Unable to verify reCaptcha");
          } */

      const userData = {
        username,
        password,
        firstName,
      };

      const propertyData = {
        propertyName,
        email: username,
      };

      const userWithProperty =
        await services.userCompositeService.createUserWithProperty(
          userData,
          propertyData
        );

      return res
        .status(200)
        .json({ msg: "Email sent", access_control_id: userWithProperty });
    } catch (e) {
      next(e);
    }
  },
];

// @desc    finish user registration
// @route   api/v2/confirm-email/:token
// @access  Public
export const finishUserRegister = [
  param("token").isJWT().withMessage("Invalid JWT token"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const token = req.params.token;

      const result = await services.userService.validateEmail(token);

      console.log(result);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },
];

// @desc resend email
// @route POST /api/v2/users/resend-email-verification
// @public
export const resendEmailVerification = [
  body("email").trim().isEmail().withMessage("Not a valid email address"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { email } = req.body;

      const result = await services.userService.resendEmail(email);
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },
];

// @desc    Create a new user for existing property
// @route   POST /api/v2/users/create
// @access  Private
export const createUser = [
  checkSchema(userRegistrationSchema),
  body("role")
    .trim()
    .isIn(["admin", "manager", "employee"])
    .withMessage("Role must be one of the following: admin, manager, employee"),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { username, password, firstName, lastName, role } =
        matchedData(req);

      const userData = {
        username,
        password,
        firstName,
        lastName: lastName || null,
        role,
      };

      if (role === "admin") {
        throw new Error("Admin user can not be created");
      }

      const propertyId = 19; // Ver de donde sacar property id.

      const result =
        await services.userCompositeService.createUserWithAccessControl(
          userData,
          propertyId
        );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },
];

// @desc Authenticate a user
// @route POST /api/v2/users/auth
// @access Public
export const authUser = [
  checkSchema(userLoginSchema),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(401);
        throw new Error(
          "We could't sign you in. Please check your username, password or verify your email."
        );
      }

      const { username, password } = matchedData(req);

      const result = await services.userService.authUser(username, password);

      return res
        .cookie("jwt", result.token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          signed: true,
          sameSite: "strict",
          maxAge: 3600 * 8 * 1000, // 8hs in milliseconds.
        })
        .status(200)
        .json({ username: result.username, firstName: result.firstName });
    } catch (e) {
      next(e);
    }
  },
];

// @desc    Validate log in
// @route   GET /api/v2/users/validate
// @access  Private
export const validateUser = (req, res, next) => {
  try {
    const signedCookie = req.signedCookie["jwt"];

    const decoded = services.tokenService.validateToken(signedCookie);

    return res.status(200).json({ decoded });
  } catch (e) {
    next(e);
  }
};
