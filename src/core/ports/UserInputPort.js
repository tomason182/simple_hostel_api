export class UserInputPort {
  constructor(userService, userCompositeService, emailService, tokenService) {
    this.userService = userService;
    this.userCompositeService = userCompositeService;
    this.emailService = emailService;
    this.tokenService = tokenService;
  }

  // Composite services
  addOrEditUser(propertyId, userData) {
    return this.userService.addOrEditUser(propertyId, userData);
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

  getUserProfile(userId, propertyId) {
    return this.userService.getUserProfile(userId, propertyId);
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

  resetUserPasswordLastStep(token, newPass, repeatNewPass) {
    return this.userService.resetUserPasswordLastStep(
      token,
      newPass,
      repeatNewPass
    );
  }

  validateNewUser(token, newPassword, repeatNewPassword) {
    return this.userService.validateNewUser(
      token,
      newPassword,
      repeatNewPassword
    );
  }

  // Token service
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }

  // Get all property users
  getAllPropertyUsers(propertyId) {
    return this.userService.getAllPropertyUsers(propertyId);
  }
}
