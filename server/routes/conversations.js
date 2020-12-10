const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");
const { isCurrentUser } = require("../middlewares/isCurrentUser");

const { conversation, userToConversation } = models;

//start a new conversation
router.post("/", restricted, (req, res) => {
  conversation
    .create()
    .then((item) => {
      userToConversation
        .bulkCreate([
          { conversationId: item.id, userId: req.body.userIdOne },
          { conversationId: item.id, userId: req.body.userIdTwo },
        ])
        .then((item) => res.status(200).json({ data: item }));
    })
    .catch((error) => res.status(400).json({ error: error }));
});

//get a list of coversation id by userId
router.get("/user/:id", restricted, isCurrentUser, (req, res) => {
  const id = req.params.id;

  userToConversation
    .findAll({
      where: {
        userId: id,
      },
    })
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(500).json({ Message: error });
    });
});

module.exports = router;
