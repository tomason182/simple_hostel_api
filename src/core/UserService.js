import { User } from "./entities/User.js";
import {
  confirmationMailBody,
  resetPasswordBody,
} from "../utils/emailBodyGenerator.js";

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

      user.setLastResendEmail();

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
      const userExist = await this.userOutputPort.findUserByUsername(email);
      if (userExist === null) {
        throw new Error("User not found");
      }

      if (userExist.is_valid_email === 1) {
        throw new Error("Email is already validated");
      }

      const user = new User(userExist);

      const waitingPeriod = user.setWaitingPeriod();

      if (Date.now() - user.getLastResendEmail() < waitingPeriod) {
        throw new Error(
          `Please wait ${
            waitingPeriod / 60 / 100
          } minutes before requesting a new email`
        );
      }

      user.setLastResendEmail();

      await this.userOutputPort.updateLastResendEmail(user);

      const token = this.userOutputPort.generateToken(user.getId(), 900);

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;
      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(user, confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return { msg: `Email sent successfully to ${user.getUsername()}` };
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

      const user = new User(userData);

      const isValidPassword = await user.comparePasswords(password);

      if (!isValidPassword) {
        throw new Error(
          "We couldn't sign you in. Please check your username, password or verify your email"
        );
      }

      // Get user access control
      const accessControl = await this.userOutputPort.findUserAccessControl(
        user.getId()
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
      const userExist = await this.userOutputPort.validateUser(
        propertyId,
        userId
      );

      if (userExist === null) {
        throw new Error("User not found");
      }

      const deletedUser = await this.userOutputPort.deleteUser(userId);

      return deletedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserPassword(
    userId,
    oldPassword,
    newPassword,
    repeatNewPassword
  ) {
    try {
      const data = await this.userOutputPort.findUserById(userId);

      console.log("oldPass: ", oldPassword);
      console.log("newPass: ", newPassword);

      if (data === null) {
        throw new Error("User not found");
      }

      const user = new User({
        username: data.username,
        firstName: data.first_name,
        lastName: data.lastName,
        passwordHash: data.password_hash,
      });

      const checkPass = user.comparePasswords(oldPassword);

      if (checkPass === false) {
        throw new Error("Invalid password");
      }

      if (newPassword !== repeatNewPassword) {
        throw new Error("Password does not match");
      }

      await user.setPasswordHash(newPassword);

      const passwordHash = user.getPasswordHash();

      const result = await this.userOutputPort.updatePassword(
        userId,
        passwordHash
      );

      return result;
    } catch (e) {
      throw e;
    }
  }

  async resetUserPassword(email) {
    try {
      const userExist = await this.userOutputPort.findUserByUsername(email);
      if (userExist === null) {
        throw new Error(
          "We couldn't find a matching account for the email address you entered. Please check the email address and try again."
        );
      }

      const waitingPeriod = 5 * 60 * 1000; // 5min * 60 seg/min * 1000 ms/seg

      if (Date.now() - userExist.last_resend_email < waitingPeriod) {
        throw new Error("Please wait 5 minutes before requesting a new email");
      }

      const lastResendEmail = Date.now();

      await this.userOutputPort.updateLastResendEmail(
        userExist.id,
        lastResendEmail
      );

      const userData = {
        username: userExist.username,
        firstName: userExist.first_name,
      };

      const token = this.userOutputPort.generateToken(userExist.id, 900);
      const confirmationLink =
        process.env.API_URL + "accounts/reset-password/new/" + token;
      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Reset your password";

      const body = resetPasswordBody(userData, confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return { msg: "email sent" };
    } catch (e) {
      throw e;
    }
  }
}
