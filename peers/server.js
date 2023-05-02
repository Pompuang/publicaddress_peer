const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const url = require("url");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
const path = require("path");
// app.enable('trust proxy')
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "static")));
app.use(express.static(__dirname + '/public'))
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/join", (req, res) => {
    const roomId = uuidv4()
    console.log( url.format({
        pathname: `/join/${roomId}`,
        query: req.query,
    }))
    console.log('join >>>')
    res.redirect(
        url.format({
            pathname: `/join/${roomId }`,
            query: req.query,
        })
    );
});

app.get("/joinold", (req, res) => {
    console.log(req.query.meeting_id)
    console.log(req.query)
    console.log(url.format({
        pathname: req.query.meeting_id,
        query: req.query,
    }))
    console.log('join room check')
    res.redirect(
        url.format({
            pathname: req.query.meeting_id,
            query: req.query,
        })
    );
});

app.get("/join/:rooms", (req, res) => {
    console.log(req.params.rooms)
    console.log('join room...')
    res.render("room", { roomid: req.params.rooms, Myname: req.query.name });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, id, myname) => {
        socket.join(roomId); // เช็ค benefit
        socket.to(roomId).broadcast.emit("user-connected", id, myname);

        socket.on("messagesend", (message) => {
            console.log(message);
            io.to(roomId).emit("createMessage", message);
        });

        socket.on("tellName", (myname) => {
            console.log(myname);
            console.log('tell....')
            socket.to(roomId).broadcast.emit("AddName", myname);
        });

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", id);
        });
    });
});

server.listen(process.env.PORT || 3030);