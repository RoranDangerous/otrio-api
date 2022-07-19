const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

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

  // try {
  //   const game = new Game(room);
  //   if(game.isAdmin(name)){
  //     game.start();
  //   }
  //   res.sendStatus(200);
  // } catch(error) {
  //   res.status(400).send({ error: error.message });
  // }
});

module.exports = router;