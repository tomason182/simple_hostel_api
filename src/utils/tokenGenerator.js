import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export function jwtTokenGenerator(userId, expiresIn = "8h") {
  const payload = {
    sub: userId,
  };

  const token = sign(payload, process.env.JWT_SECRET, { expiresIn });
  return token;
}

export function jwtTokenValidation(token) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    console.error(e.message);
    return false;
  }
}
