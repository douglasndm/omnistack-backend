const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const socketio = require("socket.io");
const http = require("http");

const routes = require("./routes");

const app  = express();
const server = http.Server(app);
const io = socketio(server);

const dotenv = require('dotenv/config')

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectedUsers = {};

io.on("connection", socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id; 
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

// req.query = acessar query parametros (para filtros)
// req.params = acessar router params (edit or delete)
// req.body = Acessar corpo da request

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);


server.listen(3333);