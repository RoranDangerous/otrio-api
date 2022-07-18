const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
var bodyParser = require('body-parser');

const port = process.env.PORT || 4001;
const gameRoutes = require("./routes/game");
const { createSocket } = require('./utils/socket');
const auth = require('./utils/auth');

const app = express();
app.use(cors(auth.corsConfig))
app.use(bodyParser.json());
app.use(gameRoutes);

const server = http.createServer(app);

createSocket(server);

server.listen(port, () => console.log(`Listening on port ${port}`));