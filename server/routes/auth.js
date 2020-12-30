const router = require("express").Router();
const passport = require("passport");
const { makeJwt } = require("../utils/makeJwt");
const querystring = require("querystring");

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  // handle with passport
  res.send("logging out");
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      token: req.token,
    });
  }
});

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
    //res.status(201).json({ data: req.user, token });
  }
);

module.exports = router;
