import { verifyCaptcha } from "../../../utils/verifyCaptcha.js";
import { validationResult, matchedData } from "express-validator";

export class UserController {
  constructor(userInputPort) {
    this.userInputPort = userInputPort;
  }

  // @desc    Register a new user
  // @route   POST /api/v2/users/register
  // @access  Public
  async userRegister(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
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

      const userWithProperty = await this.userInputPort.createUserWithProperty(
        userData,
        propertyData
      );

      return res
        .status(200)
        .json({ msg: "Email sent", access_control_id: userWithProperty });
    } catch (e) {
      next(e);
    }
  }

  // @desc    finish user registration
  // @route   api/v2/confirm-email/:token
  // @access  Public
  async finishUserRegister(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const token = req.params.token;

      const result = await this.userInputPort.validateEmail(token);

      console.log(result);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // @desc resend email
  // @route POST /api/v2/users/resend-email-verification
  // @public
  async resendEmailVerification(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { email } = req.body;

      const result = await this.userInputPort.resendEmail(email);
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // @desc    Create a new user for existing property
  // @route   POST /api/v2/users/create
  // @access  Private
  async createUser(req, res, next) {
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

      const result = await this.userInputPort.createUserWithAccessControl(
        userData,
        propertyId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // @desc Authenticate a user
  // @route POST /api/v2/users/auth
  // @access Public
  async authUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(401);
        throw new Error(
          "We could't sign you in. Please check your username, password or verify your email."
        );
      }

      const { username, password } = matchedData(req);

      const result = await this.userInputPort.authUser(username, password);

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
  }

  // @desc    Validate log in
  // @route   GET /api/v2/users/validate
  // @access  Private
  async validateUser(req, res, next) {
    try {
      const signedCookie = req.signedCookies["jwt"];

      const decoded = this.userInputPort.verifyToken(signedCookie);

      return res.status(200).json({ userId: decoded.sub });
    } catch (e) {
      next(e);
    }
  }

  // @desc    Logout a user
  // @route   GET /api/v1/users/logout
  // @access  Private
  logoutUser(req, res, next) {
    return res
      .cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        sameSite: "strict",
        maxAge: 0,
      })
      .status(200)
      .json({ msg: "User logout" });
  }
}
