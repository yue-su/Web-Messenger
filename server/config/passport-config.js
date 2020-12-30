var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "669322067793-0uevk0npdkv14dpf61bhllqm9v2s0m6v.apps.googleusercontent.com",
      clientSecret: "2a4VDFVksn8uRXihnpij0Rov",
      callbackURL: "http://localhost:3001/auth/google/redirect",
    },
    function (token, tokenSecret, profile, done) {
      console.log("token is: ", token);
    }
  )
);
