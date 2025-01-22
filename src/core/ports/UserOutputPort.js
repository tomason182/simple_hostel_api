class UserOutputPort {
  constructor(userRepository, tokenService, emailService) {
    (this.userRepository = userRepository),
      (this.tokenService = tokenService),
      (this.emailService = emailService);
  }

  // User repository methods
  async findUserByUsername(username, connection) {
    return await this.userRepository.findUserByUsername(username, connection);
  }

  async validateUserEmail(userId) {
    return await this.userRepository.validateUserEmail(userId);
  }

  async save(user, connection) {
    return await this.userRepository.save(user, connection);
  }

  async updateLastResendEmail(userId, lastResendEmailTime) {
    return await this.userRepository.updateLastResendEmail(
      userId,
      lastResendEmailTime
    );
  }

  // Security methods
  async verifyToken(token) {
    return await this.tokenService.verifyToken(token);
  }

  async generateToken(userId, expirationTime) {
    return this.tokenService.generateToken(userId, expirationTime);
  }

  // Email sender methods
  async sendEmail(to, subject, body, from) {
    return this.emailService(to, subject, body, from);
  }
}
