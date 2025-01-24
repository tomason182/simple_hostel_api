import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export class JWTTokenService {
  constructor(secret) {
    this.secret = secret;
  }

  generateToken(userData, expiration) {
    const payload = {
      sub: userData,
    };

    const token = sign(payload, this.secret, { expiresIn: expiration });
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = verify(token, this.secret);
      return decoded;
    } catch (e) {
      throw new Error("Invalid or expired token");
    }
  }
}
