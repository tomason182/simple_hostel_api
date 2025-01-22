import { confirmationMailBody } from "../utils/emailBodyGenerator.js";
import { TransactionManagerPort } from "./ports/TransactionManagerPort.js";

export class UserCompositeService extends TransactionManagerPort {
  constructor(mysqlPool) {
    super();
    this.mysqlPool = mysqlPool;
  }

  async createUserWithProperty(userData, PropertyData) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const user = await super.createUser(userData, conn);
      const property = await super.createProperty(PropertyData, conn);
      const role = "admin";
      const accessControlID = await super.saveAccessControl(
        user.id,
        property.id,
        role,
        conn
      );
      const token = super.generateToken(user.id, 900);

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(userData, confirmationLink);

      await super.sendEmail(to, subject, body, from);

      await conn.commit();
      return accessControlID;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      await conn.release();
    }
  }

  async createUserWithAccessControl(userData, propertyId) {
    const conn = await this.mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      const allPropertyUsers = await super.findAllPropertyUsers(
        propertyId,
        conn
      );

      if (allPropertyUsers.length > 4) {
        throw new Error(
          "Team members creation limited reached. You can not create more than 5 team members."
        );
      }

      const user = await super.createUser(userData, conn);
      const accessControlID = await super.saveAccessControl(
        user.id,
        propertyId,
        userData.role,
        conn
      );
      const token = super.generateToken(user.id, 900); // Expires in 900 seg || 15 min

      const confirmationLink =
        process.env.API_URL + "accounts/email-validation/" + token;

      const to = userData.username;
      const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
      const subject = "Confirm your email for SimpleHostel";
      const body = confirmationMailBody(userData, confirmationLink);

      await super.sendEmail(to, subject, body, from);

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
