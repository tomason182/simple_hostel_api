import bcrypt from "bcrypt";

export class User {
  #passwordHash;
  constructor({
    username,
    firstName,
    lastName = null,
    passwordHash = null,
    isValidEmail = false,
    lastResendEmail = null,
    createdAt = null,
    updatedAt = null,
  }) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.#passwordHash = passwordHash;
    this.isValidEmail = isValidEmail;
    this.lastResendEmail = lastResendEmail;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getter for hashed password
  getPasswordHash() {
    return this.passwordHash;
  }

  // GetUserProfile
  getUserProfile() {
    return {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Setter for hashed password
  async setPasswordHash(password, saltRounds = 10) {
    try {
      this.passwordHash = await bcrypt.hash(password, saltRounds);
    } catch (e) {
      throw new Error("Error hashing the password");
    }
  }

  // Method for compare passwords
  async comparePasswords(password) {
    try {
      const result = await bcrypt.compare(password, this.passwordHash);
      return result;
    } catch (e) {
      return false;
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

  // Set last resend email
  setEmailResend() {
    this.lastResendEmail = Date.now();
  }

  // Setter for valid email
  setValidEmail(isValid) {
    this.isValidEmail = isValid;
  }
}
