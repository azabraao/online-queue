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
  console.log("Socked connected", socket.id);

  socket.emit("render all on queue", peopleOnQueue);

  socket.on("enter on queue", (data) => {
    peopleOnQueue.push(data);
    console.log(peopleOnQueue);
    // socket.broadcast.emit("add to queue", data);
    socket.emit("render all on queue", peopleOnQueue);
    socket.broadcast.emit("render all on queue", peopleOnQueue);
  });

  socket.on("leave queue", (id) => {
    peopleOnQueue = peopleOnQueue.filter((person) => person.id != Number(id));
    socket.broadcast.emit("render all on queue", peopleOnQueue);
    socket.emit("render all on queue", peopleOnQueue);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
