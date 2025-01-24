import { confirmationMailBody } from "../utils/emailBodyGenerator.js";

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
      const role = "admin";
      const accessControlID =
        await this.userTransactionManagerPort.saveAccessControl(
          user.id,
          property.id,
          role,
          conn
        );
      const token = this.userTransactionManagerPort.generateToken(user.id, 900);

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(userData, confirmationLink);

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
      const accessControlID =
        await this.userTransactionManagerPort.saveAccessControl(
          user.id,
          propertyId,
          userData.role,
          conn
        );
      const token = this.userTransactionManagerPort.generateToken(user.id, 900); // Expires in 900 seg || 15 min

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(userData, confirmationLink);

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

      const validateUser = await this.userTransactionManagerPort.validateUser(
        propertyId,
        userData.id,
        conn
      );

      if (validateUser === null) {
        throw new Error("User not found");
      }

      const updatedUser =
        await this.userTransactionManagerPort.updateUserProfile(userData, conn);
      const updatedAccessControl =
        await this.userTransactionManagerPort.updateUserAccessControl(
          userData,
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
}
