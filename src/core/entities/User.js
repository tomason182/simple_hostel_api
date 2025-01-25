import bcrypt from "bcrypt";

export class User {
  #passwordHash;
  constructor({
    id = null,
    username,
    firstName,
    lastName = null,
    passwordHash = null,
    isValidEmail = false,
    lastResendEmail = null,
    role = null,
    createdAt = null,
    updatedAt = null,
  }) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.#passwordHash = passwordHash;
    this.isValidEmail = isValidEmail;
    this.lastResendEmail = lastResendEmail;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getter & Setter for ID
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  // Getter for username
  getUsername() {
    return this.username;
  }

  // Getter for first name
  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  // Getter for hashed password
  getPasswordHash() {
    return this.#passwordHash;
  }

  // Setter for hashed password
  async setPasswordHash(password, saltRounds = 10) {
    try {
      this.#passwordHash = await bcrypt.hash(password, saltRounds);
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

  // Set last resend email
  setLastResendEmail() {
    this.lastResendEmail = Date.now();
  }

  getLastResendEmail() {
    return this.lastResendEmail;
  }

  // Set waiting period for resend email
  setWaitingPeriod(timeInSec = 5) {
    return timeInSec * 60 * 1000;
  }

  // Setter for valid email
  setValidEmail(isValid) {
    this.isValidEmail = isValid;
  }

  // Getter for valid email
  getIsValidEmail() {
    return this.isValidEmail;
  }

  // Getter and Setter for role
  getRole() {
    return this.role;
  }

  setRole(role) {
    this.role = role;
  }
}
