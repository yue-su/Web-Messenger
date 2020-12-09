const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");

const { message } = models;

//send a new message and return its id
router.post("/", restricted, (req, res) => {
  console.log(req.body);

  message
    .create(req.body)
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((error) => res.status(400).json({ error: error }));
});

//get a list of messages by conversation id
router.get("/conversation/:id", restricted, (req, res) => {
  const id = req.params.id;

  message
    .findAll({
      where: {
        conversationId: id,
      },
    })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      res.status(500).json({ Message: error });
    });
});

module.exports = router;
