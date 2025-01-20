import bcrypt from "bcrypt";

export class User {
  constructor({ username, firstName, lastName = null, isValidEmail = false }) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = null;
    this.isValidEmail = isValidEmail;
    this.lastResendEmail = null;
  }

  // Getter for hashed password
  getPasswordHash() {
    return this.passwordHash;
  }

  // Setter for hashed password
  async setPasswordHahs(password, saltRounds = 10) {
    try {
      this.passwordHash = await bcrypt.hash(password, saltRounds);
    } catch (e) {
      throw new Error("Error hashing the password");
    }
  }

  // Method for compare passwords
  async comparePasswords(password, passwordHash) {
    try {
      const result = await bcrypt.compare(password, passwordHash);
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

  // Set last resend email
  setEmailResend() {
    this.lastResendEmail = Date.now();
  }

  // Setter for valid email
  setValidEmail(isValid) {
    this.isValidEmail = isValid;
  }
}
