export class UserOutputPort {
  constructor(
    userRepository,
    propertyRepository,
    accessControlService,
    tokenService,
    emailService
  ) {
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
    this.accessControlService = accessControlService;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  // Property repository methods
  findPropertyById(propertyId) {
    return this.propertyRepository.findPropertyById(propertyId);
  }

  // User repository methods
  findUserByUsername(username, connection = null) {
    return this.userRepository.findUserByUsername(username, connection);
  }

  findUserById(userId) {
    return this.userRepository.findUserById(userId);
  }

  findUserByIdAndPropertyId(userId, propertyId, conn = null) {
    return this.userRepository.findUserByIdAndPropertyId(
      userId,
      propertyId,
      conn
    );
  }

  validateUserEmail(userId) {
    return this.userRepository.validateUserEmail(userId);
  }

  save(user, connection = null) {
    return this.userRepository.save(user, connection);
  }

  updateLastResendEmail(user) {
    return this.userRepository.updateLastResendEmail(user);
  }

  updateUser(userData, connection = null) {
    return this.userRepository.updateUser(userData, connection);
  }

  updatePassword(user) {
    return this.userRepository.updatePassword(user);
  }

  deleteUser(userId, conn = null) {
    return this.userRepository.deleteUser(userId, conn);
  }

  addUser(propertyId, user) {
    return this.userRepository.addUser(propertyId, user);
  }

  editUser(propertyId, user) {
    {
      return this.userRepository.editUser(propertyId, user);
    }
  }

  // Access control service
  findUserAccessControl(userId) {
    return this.accessControlService.find(userId);
  }

  validateUser(propertyId, userId) {
    return this.accessControlService.findWithProperty(propertyId, userId);
  }

  // Security methods
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }

  generateToken(userData, expirationTime) {
    return this.tokenService.generateToken(userData, expirationTime);
  }

  // Email sender methods
  sendEmail(to, subject, body, from) {
    return this.emailService.sendEmail(to, subject, body, from);
  }

  getAllPropertyUsers(propertyId) {
    return this.userRepository.getAllPropertyUsers(propertyId);
  }

  getPropertyName(propertyId) {
    return this.userRepository.getPropertyName(propertyId);
  }
}
