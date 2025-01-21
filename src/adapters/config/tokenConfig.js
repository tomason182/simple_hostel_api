import { JWTTokenService } from "../security/JWTTokenService";

export function createTokenService() {
  const secret = process.env.JWT_SECRET;
  return JWTTokenService(secret);
}
