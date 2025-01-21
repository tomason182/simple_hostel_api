import "dotenv/config";
import { JWTTokenService } from "../security/JWTTokenService.js";

export function createTokenService() {
  const secret = process.env.JWT_SECRET;
  return new JWTTokenService(secret);
}
