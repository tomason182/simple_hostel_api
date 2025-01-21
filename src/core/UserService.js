import { User } from "./entities/User.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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

  async validateEmail(userId) {
    try {
      const result = await this.userRepository.validateUserEmail(userId);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
