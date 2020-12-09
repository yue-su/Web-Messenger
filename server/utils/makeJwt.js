const jwt = require("jsonwebtoken");

function makeJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = { makeJwt };
