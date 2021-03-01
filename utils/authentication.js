const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY || "test";
/**
 * checkAuth
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * check that user is authenticated by checking the token
 */
// used to check authentication as middleware
function checkAuth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("No Available token");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid Token");
  }
}

/**
 * createToken
 * @param {Number} userId
 */
// create jwt token from payload
function createToken(userId) {
  const token = jwt.sign({ id: userId }, secretKey, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
  return token;
}

/**
 * getUserIdFromRequest
 * @param {Request} req
 */
function getUserIdFromRequest(req) {
  const token = req.header("x-auth-token");
  if (!token) {
    return -1;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.id;
  } catch (ex) {
    return -1;
  }
}
module.exports = {
  checkAuth,
  createToken,
  getUserIdFromRequest,
};
