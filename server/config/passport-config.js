var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const { models } = require("../models");
const { user } = models;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    function (token, tokenSecret, profile, done) {
      console.log(token);
      console.log(profile);
      user
        .findOne({
          where: {
            email: profile.emails[0].value,
          },
        })
        .then((currentUser) => {
          if (currentUser) {
            console.log("user is", currentUser);
            done(null, currentUser);
          } else {
            const newUser = {
              username: profile.displayName,
              email: profile.emails[0].value,
              password: "NA",
              photoURL: profile.photos[0].value,
            };
            user.create(newUser).then((createdUser) => {
              console.log("new user is", createdUser);
              done(null, createdUser);
            });
          }
        });
    }
  )
);
