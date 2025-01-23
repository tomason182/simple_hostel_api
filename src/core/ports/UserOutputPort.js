export class UserOutputPort {
  constructor(userRepository, tokenService, emailService) {
    (this.userRepository = userRepository),
      (this.tokenService = tokenService),
      (this.emailService = emailService);
  }

  // User repository methods
  findUserByUsername(username, connection) {
    return this.userRepository.findUserByUsername(username, connection);
  }

  findUserById(userId) {
    return this.userRepository.findUserById(userId);
  }

  validateUserEmail(userId) {
    return this.userRepository.validateUserEmail(userId);
  }

  save(user, connection) {
    return this.userRepository.save(user, connection);
  }

  updateLastResendEmail(userId, lastResendEmailTime) {
    return this.userRepository.updateLastResendEmail(
      userId,
      lastResendEmailTime
    );
  }

  updateUser(userData, connection) {
    return this.userRepository.updateUser(userData, connection);
  }

  // Security methods
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }

  generateToken(userId, expirationTime) {
    return this.tokenService.generateToken(userId, expirationTime);
  }

  // Email sender methods
  sendEmail(to, subject, body, from) {
    return this.emailService(to, subject, body, from);
  }
}
