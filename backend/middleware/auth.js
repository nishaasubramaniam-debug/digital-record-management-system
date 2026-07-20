const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {

    // Accept token from either Authorization header or query parameter
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.query.token;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};

module.exports = auth;