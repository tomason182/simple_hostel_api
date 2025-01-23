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

  async addUserToProperty(mainUserId, userData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      // Get the access control for the user.
      const accessControl =
        await this.userTransactionManagerPort.findUserAccessControl(
          mainUserId,
          conn
        );

      const propertyId = accessControl.property_id;

      const allPropertyUsers =
        await this.userTransactionManagerPort.findAllPropertyUsers(
          propertyId,
          conn
        );

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
}
