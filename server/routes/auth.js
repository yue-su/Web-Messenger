const router = require("express").Router();
const passport = require("passport");
const { makeJwt } = require("../utils/makeJwt");
const querystring = require("querystring");

// auth with google+
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = makeJwt(req.user);
    const query = querystring.stringify({
      token: token,
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      photoURL: req.user.photoURL,
    });
    res.redirect("http://localhost:3000/login?" + query);
  }
);

module.exports = router;
