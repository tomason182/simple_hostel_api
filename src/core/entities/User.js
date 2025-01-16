const bcrypt = require("bcrypt");

class User {
  constructor({
    username,
    firstName,
    lastName,
    role = null,
    isValidEmail = false,
  }) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.hashedPassword = null;
    this.isValidEmail = isValidEmail;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Getter for hashed password
  getHashedPassword() {
    return this.hashedPassword;
  }

  // Setter for hashed password
  async setHashedPassword(password, saltRounds = 10) {
    try {
      this.hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (e) {
      throw new Error("Error hashing the password");
    }
  }

  // Method for compare passwords
  async comparePasswords(password, hashedPassword) {
    try {
      const result = await bcrypt.compare(password, hashedPassword);
      return result;
    } catch (e) {
      throw new Error("An error occurred verifying the password");
    }
  }

  // Setter for role
  setRole(role) {
    this.role = role;
  }

  // Getter for role
  getRole() {
    return this.role;
  }

  // Setter for valid email
  setValidEmail(isValid) {
    this.isValidEmail = isValid;
  }

  // Setter for update at
  setUpdateAt() {
    this.updatedAt = new Date();
  }
}

module.exports = User;
