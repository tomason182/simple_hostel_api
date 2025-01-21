import { TokenService } from "../../core/ports/TokenService";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export class JWTTokenService extends TokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  generateToken(userId, expiration) {
    const payload = {
      sub: userId,
    };

    const token = sign(payload, this.secret, { expiresIn: expiration });
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = verify(token, this.secret);
      return decoded;
    } catch (e) {
      console.error(e.message);
      return false;
    }
  }
}
