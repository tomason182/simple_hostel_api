export class UserInputPort {
  constructor(userService, userCompositeService, emailService, tokenService) {
    this.userService = userService;
    this.userCompositeService = userCompositeService;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  // Composite services
  addUserToProperty(mainUserId, userData) {
    return this.userCompositeService.addUserToProperty(mainUserId, userData);
  }

  createUserWithProperty(userData, propertyData) {
    return this.userCompositeService.createUserWithProperty(
      userData,
      propertyData
    );
  }

  editUserProfile(propertyId, userData) {
    return this.userCompositeService.editUserProfile(propertyId, userData);
  }

  // User services
  validateEmail(token) {
    return this.userService.validateEmail(token);
  }

  resendEmail(email) {
    return this.userService.resendEmail(email);
  }

  authUser(username, password) {
    return this.userService.authUser(username, password);
  }

  getUserProfile(userId) {
    return this.userService.getUserProfile(userId);
  }

  updateUserProfile(userData) {
    return this.userService.updateUserProfile(userData);
  }

  deleteUserProfile(id) {
    return this.userService.deleteUser(id);
  }

  // Token service
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }
}
