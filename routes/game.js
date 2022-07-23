const express = require('express');
const router = express.Router();
const Game = require('../game');
const auth = require('../utils/auth');

router.get('/', (_, res) => {
  res.status(200).send({ success: true });
})

router.post('/create', (req, res) => {
  const playerName = req.body.name;
  const color = req.body.color;

  const code = Game.create(playerName);

  const game = new Game(code);

  if(color){
    game.setColor(playerName, color);
  }

  res.status(200).send({ token: auth.getToken(code, playerName), code })
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

router.post('/move', (req, res) => {
  const { token, cell, chipSize } = req.body;

  let game, player;
  try {
    const values = auth.validatePlayer(token);
    game = values.game;
    player = values.player;
  }
  catch {
    return res.status(401).send('Authentication error')
  }

  try {
    game.move(player, cell, chipSize);
  }
  catch(err) {
    return res.status(400).send({ error: err.message });
  }

  res.status(200).send();
});

router.post('/reset', (req, res) => {
  const { token } = req.body;

  let game, player;
  try {
    const values = auth.validatePlayer(token);
    game = values.game;
    player = values.player;


  }
  catch {
    return res.status(401).send('Authentication error')
  }

  try {
    game.validateIsQueen(player);
    game.reset();
  }
  catch(err) {
    return res.status(400).send({ error: err.message });
  }

  res.status(200).send();
});

module.exports = router;