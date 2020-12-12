const users = {};
const userSocketIdMap = new Map();

function addUserToMap(userId, socketId) {
  if (!userSocketIdMap.has(userId)) {
    userSocketIdMap.set(userId, new Set([socketId]));
  } else {
    userSocketIdMap.get(userId).add(socketId);
  }
}

function removeUserFromMap(userId, socketId) {
  if (userSocketIdMap.has(userId)) {
    let userSocketIdSet = userSocketIdMap.get(userId);
    userSocketIdSet.delete(socketId);
    if (userSocketIdSet.size == 0) {
      userSocketIdMap.delete(userId);
    }
  }
}

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
      socket.username = user.username;
      users[user.username] = {
        socketId: socket.id,
        userId: user.userId,
        online: true,
      };
      console.log(users);
    });

    socket.on("sentMessage", (data) => {
      const { message, userTo } = data;

      if (users[userTo] && users[userTo].online) {
        socket.to(users[userTo].socketId).emit("replyMessage", message);
      }
    });

    socket.on("addConversation", (data) => {
      console.log(data);
      const userTalkTo = data.userTalkToUsername;

      socket.emit("getConversation", data.data[0]);

      if (users[userTalkTo] && users[userTalkTo].online) {
        socket
          .to(users[userTalkTo].socketId)
          .emit("getConversation", data.data[1]);
      }
    });

    socket.on("disconnect", (data) => {
      console.log("disconnect", data);
      if (users[socket.username]) {
        users[socket.username].online = false;
      }
    });
  });
};
