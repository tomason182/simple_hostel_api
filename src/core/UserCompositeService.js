import { confirmationMailBody } from "../utils/emailBodyGenerator.js";
import { User } from "./entities/User.js";

export class UserCompositeService {
  constructor(mysqlPool, userTransactionManagerPort) {
    this.mysqlPool = mysqlPool;
    this.userTransactionManagerPort = userTransactionManagerPort;
  }

  async createUserWithProperty(userData, PropertyData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const user = await this.userTransactionManagerPort.createUser(
        userData,
        conn
      );

      const property = await this.userTransactionManagerPort.createProperty(
        PropertyData,
        conn
      );

      if (user.getRole() === null) {
        user.setRole("admin");
      }

      const accessControlID =
        await this.userTransactionManagerPort.saveAccessControl(
          user.getId(),
          property.getId(),
          user.getRole(),
          conn
        );
      const token = this.userTransactionManagerPort.generateToken(
        user.getId(),
        900
      );

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(user.getFirstName(), confirmationLink);

      await this.userTransactionManagerPort.sendEmail(to, subject, body, from);

      await conn.commit();
      return accessControlID;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }

  async addUserToProperty(propertyId, userData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const allPropertyUsers =
        await this.userTransactionManagerPort.findAllPropertyUsers(
          propertyId,
          conn
        );

      if (allPropertyUsers === null) {
        throw new Error("Unable to find property ID");
      }

      if (allPropertyUsers.length > 4) {
        throw new Error(
          "Team members creation limited reached. You can not create more than 5 team members."
        );
      }

      const user = await this.userTransactionManagerPort.createUser(
        userData,
        conn
      );

      user.setRole(userData.role);
      const accessControlID =
        await this.userTransactionManagerPort.saveAccessControl(
          user.getId(),
          propertyId,
          user.getRole(),
          conn
        );
      const token = this.userTransactionManagerPort.generateToken(user.id, 900); // Expires in 900 seg || 15 min

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = user.getUsername();
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(user.getFirstName(), confirmationLink);

      await this.userTransactionManagerPort.sendEmail(to, subject, body, from);

      await conn.commit();
      return accessControlID;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }

  async editUserProfile(propertyId, userData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const userExist =
        await this.userTransactionManagerPort.findUserByIdAndPropertyId(
          userData.id,
          propertyId,
          conn
        );

      if (userExist === null) {
        throw new Error("User not found");
      }

      console.log("user exits: ", userExist);

      const user = new User(userExist);
      user.setFirstName(userData.first_name);
      user.setLastName(userData.last_name);
      user.setRole(userData.role);

      const updatedUser =
        await this.userTransactionManagerPort.updateUserProfile(user, conn);
      const updatedAccessControl =
        await this.userTransactionManagerPort.updateUserAccessControl(
          user,
          conn
        );

      await conn.commit();

      return {
        msg: `${updatedUser.changedRows} user field updated. ${updatedAccessControl.changedRows} access control fields updated`,
      };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }

  async deleteAccount(propertyId) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();
      // Find all users from the property
      const allPropertyUsers =
        await this.userTransactionManagerPort.findAllPropertyUsers(
          propertyId,
          conn
        );

      console.log("all Property users: ", allPropertyUsers);

      if (!allPropertyUsers) {
        throw new Error(
          "An unexpected error occurred trying to delete you account."
        );
      }

      // Delete all users and it access control
      for (const user of allPropertyUsers) {
        await this.userTransactionManagerPort.deleteUser(user.user_id, conn);
      }

      // Delete the property itself
      const result = await this.userTransactionManagerPort.deleteProperty(
        propertyId,
        conn
      );

      await conn.commit();
      return result;
    } catch (e) {
      await conn.rollback();
    } finally {
      await conn.release();
    }
  }
}
