const jwt = require('jsonwebtoken');
const Game = require('../game');

const SECRET_KEY = Math.random().toString(36).substring(2);

const getToken = (room, player) => jwt.sign({ room, player }, SECRET_KEY);
const validate = (token, callback) => jwt.verify(token, SECRET_KEY, callback);
const validatePlayer = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  const { room, player } = decoded;
  const game = new Game(room);
  game.validatePlayer(player);
  return { game, player }
}

const corsConfig = {
  origin: 'https://otrio.iroman.ca',
  methods: ['GET', 'POST']
};

module.exports = {
  getToken,
  validate,
  validatePlayer,
  corsConfig,
}
