const jwt = require("jsonwebtoken");

function isCurrentUser(req, res, next) {
  const requestId = req.params.id;
  const currentUserId = req.currentUser.subject;

  if (requestId == currentUserId) {
    next();
  } else {
    res
      .status(401)
      .json({ message: "you can only fetch your own conversations!" });
  }
}

module.exports = { isCurrentUser };
