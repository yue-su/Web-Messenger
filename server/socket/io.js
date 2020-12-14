const {
  userSocketIdMap,
  addUserToMap,
  removeUserFromMap,
} = require("../utils/userSocketIdMap");

module.exports = (server) => {
  //setup a socket server with cors
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  //a middleware to check the client token
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const err = new Error("not authorized");
    err.data = { content: "Carried incorrected token" };
    if (token == process.env.SOCKET_TOKEN) {
      next();
    } else {
      next(err);
    }
  });

  //a socket instance for each connected client
  io.on("connection", (socket) => {
    console.log("new socket connection");

    //when a user is connected, the userId and socketId will be added a in memory map
    // socket.on("online", (user) => {
    //   console.log("online");
    //   socket.userId = user.userId;
    //   addUserToMap(user.userId, socket.id);
    // });

    // //when received a message, check if the receiver is online, then forward the msg to the receiver if it's true.
    // socket.on("sentMessage", (data) => {
    //   const { message, currentChatReceiverId } = data;
    //   if (userSocketIdMap.has(currentChatReceiverId)) {
    //     socket
    //       .to(userSocketIdMap.get(currentChatReceiverId))
    //       .emit("replyMessage", message);
    //   }
    // });

    //This event is to license if the user initiate a new conversation. check the online users and then forward the conversation to the receiver.
    socket.on("addConversation", (data) => {
      const currentChatReceiverId = data.currentChatReceiverId;

      socket.emit("getConversation", data.data[0]);

      if (userSocketIdMap.has(currentChatReceiverId)) {
        socket
          .to(userSocketIdMap.get(currentChatReceiverId))
          .emit("getConversation", data.data[1]);
      }
    });

    //delete the user from the map when it's offline
    // socket.on("disconnect", () => {
    //   removeUserFromMap(socket.userId);
    // });
  });
};
