const auth = require('./auth');
const Game = require('../game');
const socketIo = require("socket.io");
const { onGameStateUpdate } = require('./events');

const authMiddleware = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token){
    auth.validate(socket.handshake.query.token, (err, decoded) => {
      if (err ||
        !decoded.room ||
        decoded.room !== socket.handshake.query.code
      ){
        return next(new Error('Authentication error'));
      }

      try {
        const game = new Game(decoded.room);
        game.validatePlayer(decoded.player);
      }
      catch {
        return next(new Error('Authentication error'));
      }
      socket.data = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }
}

const createSocket = (server) => {
  const io = socketIo(server, {  cors: auth.corsConfig });

  io.use(authMiddleware)
  .on('connection', (socket) => {
      const { room, player } = socket.data;

      if(room){
        const game = new Game(room);
        socket.join(room);
        game.updatePlayerConnection(player, true);
        triggerUpdate(room);
      }

      socket.on('disconnect', () => {
        const game = new Game(room);
        game.updatePlayerConnection(player, false);
        triggerUpdate(room);
      })
  })

  // trigger game updates
  const triggerUpdate = (roomCode) => {
    const game = new Game(roomCode);
    console.log(game.state)
    io.to(roomCode).emit('update', game.state);
  };
  onGameStateUpdate(triggerUpdate);
}

module.exports = {
  createSocket
}