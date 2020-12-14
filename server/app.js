require("dotenv").config();

var http = require("http");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const { join } = require("path");
const logger = require("morgan");
const cors = require("cors");
const express = require("express");
const { json, urlencoded } = express;
const app = express();
const { onError, normalizePort } = require("./utils/server");

var port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");

const usersRouter = require("./routes/users");
const conversationsRouter = require("./routes/conversations");
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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  console.log("Listening on " + bind);
}
