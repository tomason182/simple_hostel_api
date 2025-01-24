export class UserTransactionManagerPort {
  constructor(
    userService,
    propertyService,
    userRepository,
    propertyRepository,
    accessControlService,
    tokenService,
    emailService
  ) {
    this.userService = userService;
    this.propertyService = propertyService;
    this.accessControlService = accessControlService;
    this.tokenService = tokenService;
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.propertyRepository = propertyRepository;
  }

  // User methods
  createUser(userData, connection) {
    return this.userService.createUser(userData, connection);
  }

  updateUserProfile(userData, connection) {
    return this.userService.updateUserProfile(userData, connection);
  }

  deleteUser(userId, conn) {
    return this.userRepository.deleteUser(userId, conn);
  }

  // Property methods
  createProperty(propertyData, connection) {
    return this.propertyService.createProperty(propertyData, connection);
  }

  findAllPropertyUsers(propertyId, conn) {
    // Creo que aca se puede hacer un bypass y ir directo al repository.
    console.log(`Searching all users for property ${propertyId}...`);
    return this.propertyRepository.findAllPropertyUsers(propertyId, conn);
  }

  deleteProperty(propertyId, conn) {
    return this.propertyRepository.deleteProperty(propertyId, conn);
  }

  // AccessControl methods
  saveAccessControl(userId, propertyId, role, connection) {
    return this.accessControlService.save(userId, propertyId, role, connection);
  }

  findUserAccessControl(userId, connection) {
    return this.accessControlService.find(userId, connection);
  }

  validateUser(propertyId, userId, connection) {
    return this.accessControlService.findWithProperty(
      propertyId,
      userId,
      connection
    );
  }

  updateUserAccessControl(userData, connection) {
    return this.accessControlService.update(userData, connection);
  }

  // Security methods
  generateToken(userId, expirationTime) {
    return this.tokenService.generateToken(userId, expirationTime);
  }

  // Email sender methods
  sendEmail(to, subject, body, from) {
    return this.emailService.sendEmail(to, subject, body, from);
  }
}
