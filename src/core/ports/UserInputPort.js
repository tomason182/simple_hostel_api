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

  /**
   * Si bien userData contiene el role del usuario, este metodo no permite actualizar el role.
   * El schema lo permite para poder usar el mismo schema en este controlador como en el de
   * editar usuario, donde el usuario es editado por otro de rango(role) superior
   */
  updateUserProfile(userData, userId) {
    return this.userService.updateUserProfile(userData, userId);
  }

  // Token service
  verifyToken(token) {
    return this.tokenService.verifyToken(token);
  }
}
