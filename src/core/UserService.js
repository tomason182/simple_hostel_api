import { User } from "./entities/User.js";
import { confirmationMailBody } from "../utils/emailBodyGenerator.js";

export class UserService {
  constructor(userOutputPort) {
    this.userOutputPort = userOutputPort;
  }

  async createUser(userData, connection = null) {
    try {
      // Check if the user already exist.
      const userExist = await this.userOutputPort.findUserByUsername(
        userData.username,
        connection
      );

      if (userExist !== null) {
        throw new Error("User already exist");
      }

      const user = new User({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName || null,
      });

      await user.setPasswordHash(userData.password);

      user.setEmailResend();

      const result = await this.userOutputPort.save(user, connection);

      return result; // {id: userId, ...userData }
    } catch (e) {
      throw e;
    }
  }

  async validateEmail(token) {
    try {
      const decoded = await this.userOutputPort.verifyToken(token);
      const userId = decoded.sub;
      const result = await this.userOutputPort.validateUserEmail(userId);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async resendEmail(email) {
    try {
      const user = await this.userOutputPort.findUserByUsername(email);
      if (user === null) {
        throw new Error("User not found");
      }

      if (user.is_valid_email === 1) {
        throw new Error("Email already validated");
      }

      const waitingPeriod = 5 * 60 * 1000; // 5min * 60 seg/min * 1000 ms/seg

      if (Date.now() - user.last_resend_email < waitingPeriod) {
        throw new Error("Please wait 5 minutes before requesting a new email");
      }

      const lastResendEmail = Date.now();

      await this.userOutputPort.updateLastResendEmail(user.id, lastResendEmail);

      const token = this.userOutputPort.generateToken(user.id, 900);

      const userData = {
        username: user.username,
        firstName: user.first_name,
      };

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;
      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(userData, confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return userData;
    } catch (e) {
      throw e;
    }
  }

  async authUser(username, password) {
    try {
      const userData = await this.userOutputPort.findUserByUsername(username);

      if (userData === null) {
        throw new Error(
          "We couldn't sign you in. Please check your username, password or verify your email"
        );
      }

      if (userData.is_valid_email === 0) {
        throw new Error(
          "We couldn't sign you in. Please check your username, password or verify your email"
        );
      }

      const validPassword = new User({
        username: userData.username,
        firstName: userData.firstName,
        passwordHash: userData.password_hash,
      }).comparePasswords(password);

      if (!validPassword) {
        throw new Error(
          "We couldn't sign you in. Please check your username, password or verify your email"
        );
      }

      // Get user access control
      const accessControl = await this.userOutputPort.findUserAccessControl(
        userData.id
      );

      const userAccessData = {
        _id: accessControl.user_id,
        propertyId: accessControl.property_id,
        role: accessControl.role,
      };

      const token = this.userOutputPort.generateToken(userAccessData, "8h");
      return {
        username: userData.username,
        firstName: userData.first_name,
        token,
      };
    } catch (e) {
      throw e;
    }
  }

  // Get user Profile
  async getUserProfile(userId) {
    try {
      const userData = await this.userOutputPort.findUserById(userId);

      const user = new User({
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        passwordHash: userData.password_hash,
        isValidEmail: userData.is_valid_email,
        lastResendEmail: userData.last_resend_email,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      });

      const userProfile = user.getUserProfile();

      return userProfile;
    } catch (e) {
      throw e;
    }
  }

  // Update user profile
  async updateUserProfile(userData, connection = null) {
    try {
      const updatedUser = await this.userOutputPort.updateUser(
        userData,
        connection
      );

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  // Delete user
  async deleteUser(propertyId, userId) {
    try {
      // Check if the user id belongs to the property
      const userBelong = await this.userOutputPort.findUserAccessControl(
        userId,
        propertyId
      );
      const deletedUser = await this.userOutputPort.deleteUser(id);

      return deletedUser;
    } catch (e) {
      throw e;
    }
  }
}
