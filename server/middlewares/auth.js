const jwt = require("jsonwebtoken");

function restricted(req, res, next) {
  const token = req.headers.authorization;
  const secret = "it is secret";
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ you: "wrong token" });
      } else {
        req.jwt = decodedToken;
      }
      next();
    });
  } else {
    res.status(401).json({ you: "no token found in the header" });
  }
}

module.exports = { restricted };
