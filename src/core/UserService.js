const User = require("./entities/User");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(username, first_name, last_name = null) {
    // Check if the user already exist.
    const userExist = await this.userRepository.findUserByUsername(username);

    if (userExist !== null) {
      throw new Error("User already exist");
    }

    const user = new User(username, first_name, last_name);

    await this.userRepository.save(this.user);

    return user;
  }
}
