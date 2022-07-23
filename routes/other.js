const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');

router.post('/color', (req, res) => {
  const { token, color } = req.body;

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
    game.setColor(player, color);
  }
  catch(err) {
    return res.status(400).send({ error: err.message });
  }

  res.status(200).send();
})

module.exports = router;