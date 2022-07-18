const express = require('express');
const router = express.Router();
const Game = require('../game');
const { InvalidRoomError } = require('../game/exceptions');
const auth = require('../utils/auth');

router.get('/', (_, res) => {
  res.status(200).send({ success: true });
})

router.post('/create', (req, res) => {
  const name = req.body.name;
  const code = Game.create(name);
  console.log(name)

  res.status(200).send({ token: auth.getToken(code, name), code })
})

router.post('/join', (req, res) => {
  const roomCode = req.body.room;
  const playerName = req.body.name;
  const token = req.body.token ?? '';

  try {
    const game = new Game(roomCode);

    game.validateNotStarted();

    auth.validate(token, (err, decoded) => {
      if (err ||
        decoded.room !== roomCode || 
        decoded.player !== playerName || 
        !game.playerExists(playerName)
      ) {
        game.addPlayer(playerName);
      }
  
      res.send({ token: auth.getToken(roomCode, playerName) });
    })
  }
  catch(error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/start', (req, res) => {
  const name = req.body.name;
  const room = req.body.code;

  try {
    const game = new Game(room);
    if(game.isAdmin(name)){
      game.start();
    }
    res.sendStatus(200);
  } catch(error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;