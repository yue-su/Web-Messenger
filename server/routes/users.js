const { models } = require("../models");
const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const { isValid } = require("../utils/isValid");
const { makeJwt } = require("../utils/makeJwt");
const { restricted } = require("../middlewares/auth");

const { user } = models;

//return an array of users and the current logged in user
//a middleware is placed to check the user's token
router.get("/", restricted, (req, res) => {
  user
    .findAll()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => res.send(err));
});

//return a user by id
router.get("/:id", restricted, (req, res) => {
  user
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((user) => {
      res.status(200).json({ data: user });
    })
    .catch((err) => res.send(err));
});

//return the registered user information with token
//password is hashed
//a validation is placed to check all the require input and password length
router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.HASH_ROUNDS || 4;
    const hash = bcryptjs.hashSync(credentials.password, Number(rounds));
    credentials.password = hash;

    user
      .create(credentials)
      .then((user) => {
        const token = makeJwt(user);
        res.status(201).json({ data: user, token });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "username, password and email are required, and password must be at least 6 charactors",
    });
  }
});

//return the user data after logging in
//A token is returned for future requests
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (Boolean(email && password)) {
    user
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);
          res.status(200).json({
            message: `welcome back ${user.username}`,
            data: {
              userId: user.id,
              username: user.username,
            },
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password",
    });
  }
});

module.exports = router;
