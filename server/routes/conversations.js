const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");
const { isCurrentUser } = require("../middlewares/isCurrentUser");
const { Op } = require("sequelize");

const { conversation, userToConversation, user } = models;

module.exports = function (io) {
  router.post("/", restricted, (req, res) => {
    conversation
      .create({ users: req.body.users })
      .then((conversation) => {
        userToConversation
          .bulkCreate([
            {
              conversationId: conversation.id,
              userId: req.body.senderId,
              username: req.body.senderId,
            },
            {
              conversationId: conversation.id,
              userId: req.body.receiverId,
              username: req.body.receiverId,
            },
          ])
          .catch((err) => res.status(500).json({ message: "duplicate" }))
          .then((conversations) => {
            res.status(200).json(conversations);
          })
          .catch((err) => console.err(err));
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
        order: [["createdAt", "DESC"]],
      })
      .then((item) => {
        res.status(200).json(item);
      })
      .catch((error) => {
        res.status(500).json({ Message: error });
      });
  });

  //this endpoint is to find out who is the current user are talking to.
  //it only return one item in the array, which is the receiver of the conversation.
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

  return router;
};

//start a new conversation
