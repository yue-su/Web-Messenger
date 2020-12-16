const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");

const { userSocketIdMap } = require("../utils/userSocketIdMap");

const { message, user } = models;

module.exports = function (io) {
  //send a new message and return its id
  router.post("/", restricted, (req, res) => {
    message
      .create(req.body)
      .then((item) => {
        message
          .findOne({
            where: {
              id: item.id,
            },
            include: [user],
          })
          .then((message) => {
            if (userSocketIdMap.has(req.body.currentChatReceiverId)) {
              io.to(userSocketIdMap.get(req.body.currentChatReceiverId)).emit(
                "replyMessage",
                message
              );
            }
            res.status(201).json(message);
          });
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
        include: [user],
        order: [["createdAt", "DESC"]],
      })
      .then((messages) => {
        res.status(200).json(messages);
      })
      .catch((error) => {
        res.status(500).json({ Message: error });
      });
  });

  return router;
};
