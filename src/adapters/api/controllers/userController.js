import { userRegistrationSchema } from "../schemas/userSchema.js";
import { verifyCaptcha } from "../../../utils/verifyCaptcha.js";
import initializeServices from "../../../setup/services.js";
import {
  checkSchema,
  validationResult,
  matchedData,
  body,
} from "express-validator";

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

      const services = initializeServices();

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
