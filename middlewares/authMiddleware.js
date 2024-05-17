const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Attach the decoded token to the request object for further use
    req.userId = decodedToken.userId;
    console.log(decodedToken);
    next();
  });
};

module.exports = authMiddleware;
