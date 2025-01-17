const express = require("express");
const { userRegistrationSchema } = require("./schemas/userSchema");
const verifyCaptcha = require("../../utils/verifyCaptcha");
const userCompositeService = require("../../core/UserCompositeService");
const {
  checkSchema,
  validationResult,
  matchedData,
  body,
} = require("express-validator");

const router = express.Router();

router.post("/register", [
  checkSchema(userRegistrationSchema),
  body("propertyName")
    .trim()
    .escape()
    .isLength({ min: 1, max: 200 })
    .withMessage("Property name maximum length is 200 characters"),
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

      if (acceptTerms !== true) {
        throw new Error(
          "Terms and conditions must be accepted before registration"
        );
      }

      isCaptchaTokenValid = await verifyCaptcha(captchaToken);

      if (isCaptchaTokenValid === false) {
        throw new Error("Unable to verify reCaptcha");
      }

      const userData = {
        username,
        password,
        firstName,
      };

      const propertyData = {
        propertyName,
        email: username,
      };

      const user = await userCompositeService.createUserWithProperty(
        userData,
        propertyData
      );

      return res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  },
]);
