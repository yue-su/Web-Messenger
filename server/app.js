const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const { join } = require("path");
const logger = require("morgan");
const cors = require("cors");
const express = require("express");
const { json, urlencoded } = express;
const app = express();

const { socketAuth } = require("./middlewares/auth");
const { addUserToMap, removeUserFromMap } = require("./utils/userSocketIdMap");

const io = require("socket.io")({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.io = io;

io.use(socketAuth);

io.on("connection", (socket) => {
  //when a user is connected, the userId and socketId will be added a in memory map
  socket.on("online", (user) => {
    socket.userId = user.userId;
    addUserToMap(user.userId, socket.id);
  });

  //delete the user from the map when it's offline
  socket.on("disconnect", () => {
    removeUserFromMap(socket.userId);
  });
});

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const usersRouter = require("./routes/users");
const conversationsRouter = require("./routes/conversations")(io);
const messageRouter = require("./routes/messages")(io);

app.use(cors());
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/api/users", usersRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/messages", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
