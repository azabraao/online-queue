const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let peopleOnQueue = [];

io.on("connection", (socket) => {
  socket.emit("render all on queue", peopleOnQueue);

  socket.on("enter on queue", (data) => {
    peopleOnQueue.push(data);
    socket.emit("render all on queue", peopleOnQueue);
    socket.broadcast.emit("render all on queue", peopleOnQueue);
  });

  socket.on("leave queue", () => {
    peopleOnQueue = peopleOnQueue.filter((person) => person.id != socket.id);
    socket.broadcast.emit("render all on queue", peopleOnQueue);
    socket.emit("render all on queue", peopleOnQueue);
  });

  socket.on("disconnect", () => {
    peopleOnQueue = peopleOnQueue.filter((person) => person.id != socket.id);
    socket.broadcast.emit("render all on queue", peopleOnQueue);
    socket.emit("render all on queue", peopleOnQueue);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
