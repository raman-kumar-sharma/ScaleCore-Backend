const { verify } = require("../utils/jwt");
const { error } = require("../utils/response");

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return error(res, "Unauthorized", 401);
  try {
    req.user = verify(header.split(" ")[1]);
    next();
  } catch {
    error(res, "Invalid token", 401);
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return error(res, "Forbidden", 403);
  next();
};

module.exports = { authenticate, authorizeAdmin };
