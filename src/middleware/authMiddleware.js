export default function authMiddleware(tokenService) {
  return (req, res, next) => {
    const token = req.signedCookies["jwt"];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    try {
      const payload = tokenService.verifyToken(token);
      req.user = payload.userId;
      next();
    } catch (e) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
  };
}
