import bcrypt from "bcrypt";

export class User {
  #password_hash;
  #is_valid_email;
  #last_resend_email;
  constructor({
    id = null,
    username = null,
    first_name = null,
    last_name = null,
    password_hash = null,
    is_valid_email = false,
    last_resend_email = null,
    role = null,
    created_at = null,
    updated_at = null,
  }) {
    this.id = id;
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.#password_hash = password_hash;
    this.#is_valid_email = is_valid_email;
    this.#last_resend_email = last_resend_email;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
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
    return this.first_name;
  }

  setFirstName(name) {
    this.first_name = name;
  }

  // Getter and setter for last name.
  getLastName() {
    return this.last_name;
  }

  setLastName(name) {
    this.last_name = name;
  }

  // Getter for hashed password
  getPasswordHash() {
    return this.#password_hash;
  }

  // Setter for hashed password
  async setPasswordHash(password, salt_rounds = 10) {
    try {
      this.#password_hash = await bcrypt.hash(password, salt_rounds);
    } catch (e) {
      throw new Error("Error hashing the password");
    }
  }

  // Method for compare passwords
  async comparePasswords(password) {
    try {
      const result = await bcrypt.compare(password, this.#password_hash);
      return result;
    } catch (e) {
      return false;
    }
  }

  // Generate random pass
  generateRandomPassword() {
    const symbols =
      "zxcvbnmasdfghjklqwertyuiop1234567890!#$%&/()=ZXCVBNMASDFGHJKLQWERTYUIOP";

    let pass = "";
    for (let i = 0; i < 12; i++) {
      const char = symbols[Math.floor(Math.random() * 100) % symbols.length];
      pass += char;
    }

    return pass;
  }

  // GetUserProfile
  getUserProfile() {
    return {
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      role: this.role,
    };
  }

  // Set last resend email
  setLastResendEmail() {
    this.#last_resend_email = Date.now();
  }

  getLastResendEmail() {
    return this.#last_resend_email;
  }

  // Set waiting period for resend email
  setWaitingPeriod(timeInSec = 5) {
    return timeInSec * 60 * 1000;
  }

  // Setter for valid email
  setValidEmail(is_valid) {
    this.#is_valid_email = is_valid;
  }

  // Getter for valid email
  getIsValidEmail() {
    return this.#is_valid_email;
  }

  // Getter and Setter for role
  getRole() {
    return this.role;
  }

  setRole(role) {
    this.role = role;
  }
}
