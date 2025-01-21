import { User } from "./entities/User.js";

export class UserService {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async createUser(userData, connection = null) {
    try {
      // Check if the user already exist.
      const userExist = await this.userRepository.findUserByUsername(
        userData.username
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

      await this.userRepository.updateLastResendEmail(user.id);

      console.log(user);
      return user;
    } catch (e) {
      throw e;
    }
  }
}
