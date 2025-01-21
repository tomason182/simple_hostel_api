export class TokenService {
  /**
   * Generate a JET token
   * @param {string} userId - The ID of the user.
   * @returns {string} - The generated token
   */

  generateToken(userId) {
    throw new Error("generateToken method is not defined");
  }

  /**
   * Verify and decoded the JWT token
   * @param {string} token - The JWT token to verify
   * @returns {object} - The decoded payload
   */

  verifyToken(token) {
    throw new Error("verifyToken method is not implemented");
  }
}
