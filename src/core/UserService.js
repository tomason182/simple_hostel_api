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

      const user = new User(userData);

      await user.setPasswordHash(userData.password);

      user.setLastResendEmail();

      const result = await this.userOutputPort.save(user, connection);

      return result; // {id: userId }
    } catch (e) {
      throw e;
    }
  }

  async addOrEditUser(propertyId, userData) {
    try {
      // Check if user exist.
      let userExist = null;
      const userId = userData.id > 0 ? userData.id : null;
      const user = new User({
        id: userId,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name || null,
        role: userData.role,
      });
      user.setLastResendEmail();

      if (userId !== null) {
        userExist = await this.userOutputPort.findUserByIdAndPropertyId(
          userId,
          propertyId
        );

        if (userExist === null) {
          throw new Error(
            "Sorry, we could no find the user ID in this property"
          );
        }

        if (userExist !== null && userExist.username !== userData.username) {
          throw new Error("User email can not be change");
        }

        if (userExist.role === "admin" && user.getRole() !== "admin") {
          throw new Error("Admin users role can not be modify");
        }

        const result = await this.userOutputPort.editUser(propertyId, user);

        return { msg: "User Updated successfully" };
      }

      userExist = await this.userOutputPort.findUserByUsername(
        userData.username
      );

      if (userExist !== null) {
        throw new Error(`User with email ${userData.username} already exists.`);
      }

      // Generate random password
      const pass = user.generateRandomPassword();
      await user.setPasswordHash(pass);

      const result = await this.userOutputPort.addUser(propertyId, user);

      // SEND EMAIL TO USER TO VALIDATE EMAIL AND CREATE PASSWORD.
      return {
        msg: "Email sent to user to create a password and validate the account",
      };
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
      console.log("Waiting period: ", waitingPeriod);

      console.log("Diff: ", Date.now() - user.getLastResendEmail());

      if (Date.now() - user.getLastResendEmail() < waitingPeriod) {
        throw new Error(
          `Please wait ${
            waitingPeriod / 60 / 1000
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
      const body = confirmationMailBody(user.getFirstName(), confirmationLink);

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
        property_id: accessControl.property_id,
        role: accessControl.role,
      };

      const token = this.userOutputPort.generateToken(userAccessData, "8h");
      return {
        username: userData.username,
        first_name: userData.first_name,
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

      if (!userData) {
        throw new Error("User not found");
      }

      const user = new User(userData);

      const userProfile = user.getUserProfile();

      return userProfile;
    } catch (e) {
      throw e;
    }
  }

  // Delete user
  async deleteUser(propertyId, userId) {
    try {
      // Check if the user id belongs to the property
      const userExist = await this.userOutputPort.findUserByIdAndPropertyId(
        userId,
        propertyId
      );

      if (userExist === null) {
        throw new Error("User not found");
      }

      if (userExist?.role === "admin") {
        throw new Error("Admin user can not be deleted");
      }

      const deletedUser = await this.userOutputPort.deleteUser(userId);

      return deletedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserProfile(userData) {
    try {
      const userExits = await this.userOutputPort.findUserById(userData.id);
      if (userExits === null) {
        throw Error("User not found");
      }
      const user = new User(userExits);

      user.setFirstName(userData.first_name);
      user.setLastName(userData.last_name);

      const result = await this.userOutputPort.updateUser(user);
      return result;
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

      if (data === null) {
        throw new Error("User not found");
      }

      const user = new User(data);

      const checkPass = await user.comparePasswords(oldPassword);

      if (checkPass === false) {
        throw new Error("Invalid password");
      }

      if (newPassword !== repeatNewPassword) {
        throw new Error("Password does not match");
      }

      await user.setPasswordHash(newPassword);

      const result = await this.userOutputPort.updatePassword(user);

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

      const user = new User(userExist);

      const waitingPeriod = user.setWaitingPeriod();

      if (Date.now() - user.getLastResendEmail() < waitingPeriod) {
        throw new Error("Please wait 5 minutes before requesting a new email");
      }

      user.setLastResendEmail();

      await this.userOutputPort.updateLastResendEmail(user);

      const token = this.userOutputPort.generateToken(user.getId(), 900);
      const confirmationLink =
        process.env.API_URL + "accounts/reset-password/new/" + token;
      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Reset your password";

      const body = resetPasswordBody(user.getFirstName(), confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return { msg: "email sent" };
    } catch (e) {
      throw e;
    }
  }

  async resetUserPasswordLastStep(token, newPass, repeatNewPass) {
    try {
      if (newPass !== repeatNewPass) {
        throw Error("Passwords do not match");
      }

      const decode = this.userOutputPort.verifyToken(token);
      const userId = decode.sub;

      const userExist = await this.userOutputPort.findUserById(userId);

      if (userExist === null) {
        throw Error("We couldn't find the user");
      }

      const user = new User(userExist);
      await user.setPasswordHash(newPass);

      const result = this.userOutputPort.updatePassword(user);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async getAllPropertyUsers(propertyId) {
    try {
      const usersList = await this.userOutputPort.getAllPropertyUsers(
        propertyId
      );

      const users = [];

      for (const element of usersList) {
        const user = new User(element);

        users.push(user);
      }

      return users;
    } catch (e) {
      throw e;
    }
  }
}
