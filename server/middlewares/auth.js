const jwt = require("jsonwebtoken");

function restricted(req, res, next) {
  //a token must be placed in the request head and will be checked with the same secret
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET;
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          you: "no access granted as the token is incorrect or expired",
        });
      } else {
        req.currentUser = decodedToken;
      }
      next();
    });
  } else {
    res.status(401).json({ you: "no token found in the header" });
  }
}

module.exports = { restricted };
