const { models } = require("../models");
const router = require("express").Router();
const { restricted } = require("../middlewares/auth");

const { userSocketIdMap } = require("../utils/userSocketIdMap");

const { message, user } = models;

module.exports = function (io) {
  //send a new message and return its id
  router.post("/", restricted, async (req, res) => {
    try {
      const messageAdded = await message.create(req.body);
      const messageFound = await message.findOne({
        where: {
          id: messageAdded.id,
        },
        include: [user],
      });

      if (userSocketIdMap.has(req.body.currentChatReceiverId)) {
        io.to(userSocketIdMap.get(req.body.currentChatReceiverId)).emit(
          "replyMessage",
          messageFound
        );
      }
      res.status(201).json(messageFound);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  });

  //get a list of messages by conversation id
  router.get("/conversation/:id", restricted, async (req, res) => {
    const id = req.params.id;

    try {
      const messagesFound = await message.findAll({
        where: {
          conversationId: id,
        },
        include: [user],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(messagesFound);
    } catch (error) {
      res.status(500).json({ Message: error });
    }
  });

  return router;
};
