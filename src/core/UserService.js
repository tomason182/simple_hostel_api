const User = require("./entities/User");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(username, first_name, last_name = null, connection = null) {
    try {
      // Check if the user already exist.
      const userExist = await this.userRepository.findUserByUsername(
        username,
        connection
      );

      if (userExist !== null) {
        throw new Error("User already exist");
      }

      const user = new User(username, first_name, last_name);

      await this.userRepository.save(user, connection);

      return user;
    } catch (e) {
      throw new Error(
        `An error occurred when trying to register a user: ${e.message}`
      );
    }
  }
}

module.exports = UserService;
