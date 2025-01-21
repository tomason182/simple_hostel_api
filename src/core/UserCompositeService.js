import { confirmationMailBody } from "../utils/emailBodyGenerator.js";

export class UserCompositeService {
  constructor(
    userService,
    propertyService,
    accessControlService,
    transactionManagerPort,
    emailService,
    tokenService
  ) {
    this.userService = userService;
    this.propertyService = propertyService;
    this.accessControlService = accessControlService;
    this.transactionManagerPort = transactionManagerPort;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  async createUserWithProperty(userData, PropertyData) {
    return this.transactionManagerPort.runInTransaction(async connection => {
      try {
        const user = await this.userService.createUser(userData, connection);
        const property = await this.propertyService.createProperty(
          PropertyData,
          connection
        );
        const role = "admin";
        const accessControlID = await this.accessControlService.save(
          user.id,
          property.id,
          role,
          connection
        );

        const token = this.tokenService.generateToken(user.id, 900); // expiration 900 seg || 15min

        const confirmationLink =
          process.env.API_URL + "accounts/email-validation/" + token;

        const to = userData.username;
        const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
        const subject = "Confirm your email for SimpleHostel";
        const body = confirmationMailBody(userData, confirmationLink);

        await this.emailService.sendEmail(to, subject, body, from);

        return accessControlID;
      } catch (e) {
        throw e;
      }
    });
  }

  async createUserWithAccessControl(userData, propertyId) {
    return this.transactionManagerPort.runInTransaction(async connection => {
      try {
        // Check if property has 5 or more users
        const allUsers = await this.propertyService.findAllPropertyUsers(
          propertyId,
          connection
        );
        if (allUsers.length > 4) {
          throw new Error(
            "Team members creation limited reached. You can not create more than 5 team members."
          );
        }

        const user = await this.userService.createUser(userData, connection);
        const accessControlID = await this.accessControlService.save(
          user.id,
          propertyId,
          userData.role,
          connection
        );

        const token = this.tokenService.generateToken(user.id, 900); // expiration 900 seg || 15min

        const confirmationLink =
          process.env.API_URL + "accounts/email-validation/" + token;

        const to = userData.username;
        const from = `Simple Hostel <${process.env.ACCOUNT_USER}>`;
        const subject = "Confirm your email for SimpleHostel";
        const body = confirmationMailBody(userData, confirmationLink);

        await this.emailService.sendEmail(to, subject, body, from);

        return accessControlID;
      } catch (e) {
        throw e;
      }
    });
  }
}
