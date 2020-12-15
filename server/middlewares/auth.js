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

function socketAuth(socket, next) {
  const token = socket.handshake.auth.token;
  const secret = process.env.JWT_SECRET;

  if (socket.handshake.auth && token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
}

module.exports = { restricted, socketAuth };
