const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");
const { isCurrentUser } = require("../middlewares/isCurrentUser");
const { Op } = require("sequelize");

const { conversation, userToConversation, user } = models;

//start a new conversation
router.post("/", restricted, (req, res) => {
  conversation
    .create()
    .then((conversation) => {
      userToConversation
        .bulkCreate([
          {
            conversationId: conversation.id,
            userId: req.body.userIdOne,
            username: req.body.usernameOne,
          },
          {
            conversationId: conversation.id,
            userId: req.body.userIdTwo,
            username: req.body.usernameTwo,
          },
        ])
        .then((conversations) => res.status(200).json({ data: conversations }));
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
      include: [user],
      order: [["createdAt", "DESC"]],
    })
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(500).json({ Message: error });
    });
});

router.get("/:id", restricted, (req, res) => {
  const id = req.params.id;
  const currentUserId = req.currentUser.subject;
  userToConversation
    .findAll({
      where: {
        [Op.and]: [
          { conversationId: id },
          {
            userId: {
              [Op.ne]: currentUserId,
            },
          },
        ],
      },
      include: [user],
    })
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(500).json({ Message: error });
    });
});

module.exports = router;
