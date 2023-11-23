function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (typeof authHeader !== "undefined") {
    const auth = authHeader.split(" ");
    const token = auth[1];
    req.token = token;
    next();
  } else {
    res.status(401).json({
      result: "Token is not provided",
    });
  }
}

module.exports = verifyToken;
