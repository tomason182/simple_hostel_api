import { User } from "./entities/User.js";
import { confirmationMailBody } from "../utils/emailBodyGenerator.js";

export class UserService {
  constructor(userRepository, tokenService, emailService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  async createUser(userData, connection = null) {
    try {
      // Check if the user already exist.
      const userExist = await this.userRepository.findUserByUsername(
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

      await user.setPasswordHahs(userData.password);

      user.setEmailResend();

      const result = await this.userRepository.save(user, connection);

      return result; // {id: userId, ...userData }
    } catch (e) {
      throw e;
    }
  }

  async validateEmail(token) {
    try {
      const decoded = await this.tokenService.verifyToken(token);
      const userId = decoded.sub;
      const result = await this.userRepository.validateUserEmail(userId);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async resendEmail(email) {
    try {
      const user = await this.userRepository.findUserByUsername(email);
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

      await this.userRepository.updateLastResendEmail(user.id, lastResendEmail);

      const token = this.tokenService.generateToken(user.id, 900);

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

      await this.emailService.sendEmail(to, subject, body, from);

      return user;
    } catch (e) {
      throw e;
    }
  }
}
