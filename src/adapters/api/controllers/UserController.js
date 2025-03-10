import { verifyCaptcha } from "../../../utils/verifyCaptcha.js";
import { validationResult, matchedData } from "express-validator";

export class UserController {
  constructor(userInputPort) {
    this.userInputPort = userInputPort;
  }

  // @desc    Register a new user
  // @route   POST /api/v2/users/register
  // @access  Public
  userRegister = async (req, res, next) => {
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

      if (acceptTerms !== true) {
        throw new Error(
          "Terms and conditions must be accepted before registration"
        );
      }

      console.log("token: ", captchaToken);
      const isCaptchaTokenValid = await verifyCaptcha(captchaToken);
      console.log("isTokenValid: ", isCaptchaTokenValid);

      if (isCaptchaTokenValid === false) {
        throw new Error("Unable to verify reCaptcha");
      }

      const userData = {
        username,
        password,
        first_name: firstName,
      };

      const propertyData = {
        property_name: propertyName,
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
  };

  // @desc    finish user registration
  // @route   api/v2/confirm-email/:token
  // @access  Public
  finishUserRegister = async (req, res, next) => {
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
  };

  // @desc resend email
  // @route POST /api/v2/users/resend-email-verification
  // @public
  resendEmailVerification = async (req, res, next) => {
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
  };

  // @desc    Create a new user for existing property or edit user
  // @route   POST /api/v2/users/create
  // @access  Private
  createUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const property_id = req.user.property_id;

      const { id, username, first_name, last_name, role } = matchedData(req);

      const userData = {
        id,
        username,
        first_name: first_name,
        last_name: last_name || null,
        role,
      };

      if (role === "admin") {
        throw new Error("Admin user can not be created");
      }

      const result = await this.userInputPort.addOrEditUser(
        property_id,
        userData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Authenticate a user
  // @route POST /api/v2/users/auth
  // @access Public
  authUser = async (req, res, next) => {
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

      res.cookie("jwt", result.token, {
        domain:
          process.env.NODE_ENV === "production"
            ? ".simplehostel.net"
            : "localhost",
        path: "/",
        httpOnly: true,
        secure: true,
        signed: true,
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "None",
        partitioned: true,
        maxAge: 3600 * 8 * 1000, // 8hs in milliseconds.
      });

      return res
        .status(200)
        .json({ username: result.username, firstName: result.first_name });
    } catch (e) {
      next(e);
    }
  };

  // @desc    Validate log in
  // @route   GET /api/v2/users/validate
  // @access  Private
  validateUser = (req, res, next) => {
    try {
      const signedCookie = req.signedCookies["jwt"];

      const decoded = this.userInputPort.verifyToken(signedCookie);

      return res.status(200).json({ userInfo: decoded.sub });
    } catch (e) {
      next(e);
    }
  };

  // @desc    Logout a user
  // @route   GET /api/v1/users/logout
  // @access  Private
  logoutUser = (req, res, next) => {
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
  };

  // @desc    Get user profile
  // @route   GET /api/v1/users/profile/
  // @access  Private
  getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const userProfile = await this.userInputPort.getUserProfile(userId);

      return res.status(200).json(userProfile);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Update user profile
  // @route   PUT /api/v1/users/profile/
  // @access  Private
  updateUserProfile = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const userId = req.user._id;
      const { firstName, lastName, role } = matchedData(req);
      userData = {
        first_name: firstName,
        last_name: lastName || null,
        role,
        id: userId,
      };

      const result = await this.userInputPort.updateUserProfile(userData);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Edit users info
  // @route PUT /api/v1/users/profile/:id
  // @access Private
  editUserProfile = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      console.log("propertyId:", propertyId);
      const { firstName, lastName, role, id } = matchedData(req);

      const userData = {
        id,
        first_name: firstName,
        last_name: lastName || null,
        role,
      };

      const result = await this.userInputPort.editUserProfile(
        propertyId,
        userData
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Delete user profile
  // @route   DELETE /api/v1/users/profile/:id
  // @access  Private
  deleteUserProfile = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const propertyId = req.user.property_id;
      const data = matchedData(req);

      const userId = parseInt(data.id);

      if (req.user._id === userId) {
        res.status(403);
        throw new Error("To delete your own account go to settings.");
      }

      const result = await this.userInputPort.deleteUserProfile(
        propertyId,
        userId
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Delete account
  // @route   DELETE /api/v1/users/account/delete/
  // @access  Private
  deleteUserAccount = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;
      const userRole = req.user.role;

      if (userRole !== "admin") {
        res.status(403);
        throw new Error("You do no have permission to delete this account.");
      }

      const result = await this.userInputPort.deleteAccount(propertyId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Update password
  // @route   PUT /api/v1/users/profile/change-password
  // @access  Private
  updateUserPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const { currentPassword, newPassword, repeatNewPassword } =
        matchedData(req);

      const userId = req.user._id;

      const result = await this.userInputPort.updateUserPassword(
        userId,
        currentPassword,
        newPassword,
        repeatNewPassword
      );
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Reset password
  // @route   POST /api/v1/users/reset-password/init-change-pass/
  // @access  Public
  resetUserPassword = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const { username } = matchedData(req);

      const result = await this.userInputPort.resetUserPassword(username);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc    Reset password last step
  // @route   PUT /api/v1/users/reset-password/finish-pass-change/:token
  // @access  Private
  resetUserPasswordLastStep = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const data = matchedData(req);
      console.log(data);

      const result = await this.userInputPort.resetUserPasswordLastStep(
        data.token,
        data.newPassword,
        data.repeatNewPassword
      );

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  // @desc Get all property users
  // @route GET /api/v1/users/all
  // @access Private
  getAllPropertyUsers = async (req, res, next) => {
    try {
      const propertyId = req.user.property_id;

      const result = await this.userInputPort.getAllPropertyUsers(propertyId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
