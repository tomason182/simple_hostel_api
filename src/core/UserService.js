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
        return {
          status: "error",
          msg: "EMAIL_EXISTS",
        };
      }

      const user = new User(userData);

      await user.setPasswordHash(userData.password);

      user.setLastResendEmail();

      const result = await this.userOutputPort.save(user, connection);

      return result; // { user }
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
          return {
            status: "error",
            msg: "USER_NOT_FOUND",
          };
        }

        if (userExist !== null && userExist.username !== userData.username) {
          return {
            status: "error",
            msg: "EMAIL_NOT_CHANGE",
          };
        }

        if (userExist.role === "admin") {
          return {
            status: "error",
            msg: "ADMIN_NOT_CHANGE",
          };
        }

        const result = await this.userOutputPort.editUser(propertyId, user);

        return {
          status: "ok",
          msg: "USER_UPDATED",
        };
      }

      userExist = await this.userOutputPort.findUserByUsername(
        userData.username
      );

      if (userExist !== null) {
        return {
          status: "error",
          msg: "USER_EXIST",
        };
      }

      // LIMIT PROPERTY USER TO 5.
      const propertyTotalUsers = await this.getAllPropertyUsers(propertyId);

      if (propertyTotalUsers.length > 4) {
        return {
          status: "error",
          msg: "TEAM_MEMBERS_LIMIT",
        };
      }

      // Get Property name
      const propertyInfo = await this.userOutputPort.findPropertyById(
        propertyId
      );

      // Generate random password
      const pass = user.generateRandomPassword();
      await user.setPasswordHash(pass);

      const result = await this.userOutputPort.addUser(propertyId, user);

      // SEND EMAIL TO USER TO VALIDATE EMAIL AND CREATE PASSWORD.
      const tokenData = {
        id: user.getId(),
        email: user.getUsername(),
        propertyName: propertyInfo.property_name,
      };
      const token = this.userOutputPort.generateToken(tokenData, 900); // Expires in 900 seg || 15 min

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation-and-password/" + token;

      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(user.getFirstName(), confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);
      return {
        status: "ok",
        msg: "EMAIL_SENT",
      };
    } catch (e) {
      throw e;
    }
  }

  async validateNewUser(token, newPassword, repeatNewPassword) {
    try {
      if (newPassword !== repeatNewPassword) {
        return {
          status: "error",
          msg: "PASSWORD_NOT_MATCH",
        };
      }
      // Validar que el token es correcto
      const decoded = await this.userOutputPort.verifyToken(token);
      const userId = decoded.sub.id;

      const userExist = await this.userOutputPort.findUserById(userId);

      if (userExist === null) {
        return {
          status: "error",
          msg: "USER_NOT_FOUND",
        };
      }

      await this.userOutputPort.validateUserEmail(userId);

      const user = new User(userExist);
      await user.setPasswordHash(newPassword);

      const result = this.userOutputPort.updatePassword(user);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async validateEmail(token) {
    try {
      const decoded = await this.userOutputPort.verifyToken(token);
      // Cuando se reenvia el email el token contiene el id y el email
      const userId = decoded.sub.id;
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
        return {
          status: "error",
          msg: "USER_NOT_FOUND",
        };
      }

      if (userExist.is_valid_email === 1) {
        return {
          status: "error",
          msg: "EMAIL_VALIDATED",
        };
      }

      const user = new User(userExist);

      const waitingPeriod = user.setWaitingPeriod();

      if (Date.now() - user.getLastResendEmail() < waitingPeriod) {
        const timeLeft =
          waitingPeriod - (Date.now() - user.getLastResendEmail());
        return {
          status: "error",
          msg: "WAITING_PERIOD",
          time: parseInt(timeLeft / 60 / 1000),
        };
      }

      user.setLastResendEmail();

      await this.userOutputPort.updateLastResendEmail(user);

      // Cuando se reenvia mail de confirmación es necesario tener el email tambien
      // en el token para poder extraerlo en la front y utilizarlo.
      const tokenData = {
        userId: user.getId(),
        email: user.getUsername(),
      };
      const token = this.userOutputPort.generateToken(tokenData, 900);

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;
      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(user.getFirstName(), confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return { status: "ok", msg: "EMAIL_SENT" };
    } catch (e) {
      throw e;
    }
  }

  async authUser(username, password) {
    try {
      const userData = await this.userOutputPort.findUserByUsername(username);

      if (userData === null) {
        return {
          status: "error",
          msg: "invalid credentials",
        };
      }

      if (userData.is_valid_email === 0) {
        return {
          status: "error",
          msg: "invalid credentials",
        };
      }

      const user = new User(userData);

      const isValidPassword = await user.comparePasswords(password);

      if (!isValidPassword) {
        return {
          status: "error",
          msg: "invalid credentials",
        };
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
  async getUserProfile(userId, propertyId) {
    try {
      const userData = await this.userOutputPort.findUserById(userId);

      const propertyName = await this.userOutputPort.getPropertyName(
        propertyId
      );

      if (!userData) {
        return {
          status: "error",
          msg: "User not found",
        };
      }

      const user = new User(userData);

      const userProfile = user.getUserProfile();

      return { ...userProfile, property_name: propertyName.property_name };
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

      console.log(userExist);

      if (userExist === null) {
        return {
          status: "error",
          msg: "USER_NOT_FOUND",
        };
      }

      if (userExist?.role === "admin") {
        return {
          status: "error",
          msg: "ADMIN_NOT_DELETE",
        };
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
        return {
          status: "error",
          msg: "Invalid password",
        };
      }

      if (newPassword !== repeatNewPassword) {
        return {
          status: "error",
          msg: "Password does not match",
        };
      }

      await user.setPasswordHash(newPassword);

      const result = await this.userOutputPort.updatePassword(user);

      return { status: "ok", result };
    } catch (e) {
      throw e;
    }
  }

  async resetUserPassword(email) {
    try {
      const userExist = await this.userOutputPort.findUserByUsername(email);
      if (userExist === null) {
        return {
          status: "error",
          msg: "USER_NOT_FOUND",
        };
      }

      const user = new User(userExist);

      const waitingPeriod = user.setWaitingPeriod();

      if (Date.now() - user.getLastResendEmail() < waitingPeriod) {
        return {
          status: "error",
          msg: "WAITING_PERIOD",
        };
      }

      user.setLastResendEmail();

      await this.userOutputPort.updateLastResendEmail(user);

      const tokenData = {
        id: user.getId(),
        email: user.getUsername(),
      };

      const token = this.userOutputPort.generateToken(tokenData, 900);
      const confirmationLink =
        process.env.API_URL + "accounts/reset-password/new/" + token;
      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Reset your password";

      const body = resetPasswordBody(user.getFirstName(), confirmationLink);

      await this.userOutputPort.sendEmail(to, subject, body, from);

      return { status: "ok", msg: "EMAIL_SENT" };
    } catch (e) {
      throw e;
    }
  }

  async resetUserPasswordLastStep(token, newPass, repeatNewPass) {
    try {
      if (newPass !== repeatNewPass) {
        return {
          status: "error",
          msg: "PASSWORD_NOT_MATCH",
        };
      }

      const decode = this.userOutputPort.verifyToken(token);
      const userId = decode.sub.id;

      const userExist = await this.userOutputPort.findUserById(userId);

      if (userExist === null) {
        return {
          status: "error",
          msg: "USER_NOT_FOUND",
        };
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

  async requestUpgrade(userId, propertyId) {
    try {
      // Check if property already request and upgrade.
      const hasRequest = await this.userOutputPort.findUpgradeRequest(
        propertyId
      );

      if (hasRequest !== null) {
        return {
          status: "error",
          msg: "ALREADY_REQUEST",
        };
      }
      // Get property contact info
      const contactInfo = await this.userOutputPort.findPropertyDetails(
        propertyId
      );

      // Save the request in the database
      const status = "pending";
      await this.userOutputPort.saveRequest(
        userId,
        propertyId,
        contactInfo.email,
        status
      );

      const to = contactInfo.email;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Account Upgrade Request";
      const body = `<p>${contactInfo.property_name} request an account upgrade. Property email is: ${contactInfo.email} and phone number is: ${contactInfo.country_code}-${contactInfo.phone_number}</p>`;

      await this.userOutputPort.sendEmail(to, subject, body, from);
      return {
        status: "ok",
        msg: "EMAIL_SENT",
      };
    } catch (e) {
      throw e;
    }
  }
}
