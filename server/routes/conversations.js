const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");

const { conversation } = models;

//start a new conversation and return its id
router.post("/", restricted, (req, res) => {
  conversation
    .create(req.body)
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((error) => res.status(400).json({ error: error }));
});

//get a list of coversation by userId
router.get("/user/:id", restricted, (req, res) => {
  const id = req.params.id;

  conversation
    .findAll({
      where: {
        userId: id,
      },
    })
    .then((conversations) => {
      res.status(200).json(conversations);
    })
    .catch((error) => {
      res.status(500).json({ Message: error });
    });
});

module.exports = router;
