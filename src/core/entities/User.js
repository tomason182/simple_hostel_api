class User {
  constructor(username, first_name, last_name) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  setHashedPassword(password) {
    this.hashed_password = password;
  }

  setRole(role) {
    this.role = role;
  }

  setValidEmail(isValid) {
    this.isValidEmail = isValid;
  }

  setUpdateAt() {
    this.updated_At = new Date();
  }
}

module.exports = User;
