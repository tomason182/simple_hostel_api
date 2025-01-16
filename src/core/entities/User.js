const bcrypt = require("bcrypt");

class User {
  constructor({
    username,
    first_name,
    last_name,
    role = null,
    isValidEmail = false,
  }) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.hashed_password = null;
    this.role = role;
    this.isValidEmail = isValidEmail;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  // Getter for hashed password
  getHashedPassword() {
    return this.hashed_password;
  }

  // Setter for hashed password
  async setHashedPassword(password, saltRounds = 10) {
    try {
      this.hashed_password = await bcrypt.hash(password, saltRounds);
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
    this.updated_At = new Date();
  }
}

module.exports = User;
