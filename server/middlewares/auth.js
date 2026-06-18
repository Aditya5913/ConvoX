const jwt = require("jsonwebtoken");

exports.checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing or malformed",
      });
    }

    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
