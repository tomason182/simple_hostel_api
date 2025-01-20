import { jwtTokenGenerator } from "../utils/tokenGenerator.js";
import { confirmationMailBody } from "../utils/emailBodyGenerator.js";

export class UserCompositeService {
  constructor(
    userService,
    propertyService,
    accessControlService,
    transactionManagerPort,
    emailService
  ) {
    this.userService = userService;
    this.propertyService = propertyService;
    this.accessControlService = accessControlService;
    this.transactionManagerPort = transactionManagerPort;
    this.emailService = emailService;
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

        const token = jwtTokenGenerator(user.id);

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
