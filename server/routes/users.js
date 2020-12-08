const { models } = require("../models");
const router = require("express").Router();

const { user, conversation, message } = models;

//a testing endpoint adding users without hashed password
router.post("/register", (req, res) => {
  user
    .create(req.body)
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
