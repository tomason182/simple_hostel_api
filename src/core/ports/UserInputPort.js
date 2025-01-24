export class UserInputPort {
  constructor(userService, userCompositeService, emailService, tokenService) {
    this.userService = userService;
    this.userCompositeService = userCompositeService;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  // Composite services
  addUserToProperty(propertyId, userData) {
    return this.userCompositeService.addUserToProperty(propertyId, userData);
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

  deleteAccount(propertyId) {
    return this.userCompositeService.deleteAccount(propertyId);
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

  deleteUserProfile(propertyId, userId) {
    return this.userService.deleteUser(propertyId, userId);
  }

  updateUserPassword(userId, password, newPassword, repeatNewPassword) {
    return this.userService.updateUserPassword(
      userId,
      password,
      newPassword,
      repeatNewPassword
    );
  }

  resetUserPassword(email) {
    return this.userService.resetUserPassword(email);
  }

  // Token service
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }
}
