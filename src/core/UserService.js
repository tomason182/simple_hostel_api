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

      const user = new User(
        userData.username,
        userData.first_name,
        userData.last_name || null
      );

      await user.setHashedPassword(userData.password);

      const result = await this.userRepository.save(user, connection);

      return result; // {id: userId, ...userData }
    } catch (e) {
      throw new Error(
        `An error occurred when trying to register a user: ${e.message}`
      );
    }
  }
}
