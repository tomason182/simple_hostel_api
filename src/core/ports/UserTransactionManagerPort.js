export class UserTransactionManagerPort {
  constructor(
    userService,
    propertyService,
    accessControlService,
    tokenService,
    emailService
  ) {
    this.userService = userService;
    this.propertyService = propertyService;
    this.accessControlService = accessControlService;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  // User methods
  createUser(userData, connection) {
    return this.userService.createUser(userData, connection);
  }

  // Property methods
  createProperty(propertyData, connection) {
    return this.propertyService.createProperty(propertyData, connection);
  }

  findAllPropertyUsers(propertyId, conn) {
    return this.propertyService.findAllPropertyUsers(propertyId, conn);
  }

  // AccessControl methods
  saveAccessControl(userId, propertyId, role, connection) {
    return this.accessControlService.save(userId, propertyId, role, connection);
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
