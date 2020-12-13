const {
  userSocketIdMap,
  addUserToMap,
  removeUserFromMap,
} = require("./userSocketIdMap");

module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const err = new Error("not authorized");
    err.data = { content: "Carried incorrected token" };
    if (token == "socketToken") {
      next();
    } else {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("new socket connection");

    socket.on("online", (user) => {
      console.log("online");
      socket.userId = user.userId;
      addUserToMap(user.userId, socket.id);
    });

    socket.on("sentMessage", (data) => {
      const { message, currentChatReceiverId } = data;
      if (userSocketIdMap.has(currentChatReceiverId)) {
        socket
          .to(userSocketIdMap.get(currentChatReceiverId))
          .emit("replyMessage", message);
      }
    });

    socket.on("addConversation", (data) => {
      console.log(data);
      const currentChatReceiverId = data.currentChatReceiverId;

      socket.emit("getConversation", data.data[0]);

      if (userSocketIdMap.has(currentChatReceiverId)) {
        socket
          .to(userSocketIdMap.get(currentChatReceiverId))
          .emit("getConversation", data.data[1]);
      }
    });

    socket.on("disconnect", () => {
      removeUserFromMap(socket.userId);
    });
  });
};
