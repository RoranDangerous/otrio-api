const random = require('../utils/random');
const GameValidation = require('./validations');

class Game extends GameValidation {
  static create = (playerName) => {
    // Tries generating unique 4-letter code
    // Stops at 100 attempts
    let tries = 0;

    while (tries < 100) {
      tries += 1;
      const code = random.generateRoomCode();

      if (Game.roomExists(code)) {
        continue;
      }

      Game.rooms[code] = Game.getNewState();
      Game.rooms[code].queen = playerName;
      Game.rooms[code].players = {
        [playerName]: Game.getNewPlayerState()
      }

      return code;
    }
  }

  addPlayer = (playerName) => {
    this.validateUniquePlayerName(playerName);
    this.validatePlayersLimit();

    const existingColors = Object.values(this.state.players).map(({ color }) => color);
    this.state.players[playerName] = Game.getNewPlayerState(existingColors);
  }

  updatePlayerConnection = (playerName, connected) => {
    this.validatePlayer(playerName);

    this.state.players[playerName].connected = connected;

    if(!connected && !this.state.inProgress){
      delete this.state.players[playerName];

      if(this.state.queen === playerName){
        this.state.queen = Object.keys(this.state.players)[0];
      }
    }

    const allDisconnected = Object.values(this.state.players).reduce((i, j) => i && !j.connected, true);
    if(allDisconnected){
      delete Game.rooms[this.roomCode];
    }
  }

  start = () => {
    this.state.inProgress = true;
    this.state.playersPosition = random.shuffle(Object.keys(this.state.players));
    this.update();
  }

  move = (playerName, cell, chipSize) => {
    this.validatePlayerChip(playerName, chipSize);
    this.validatePlayerTurn(playerName);
    this.validateCellAction(cell, chipSize);
    this.validateNoWinners();

    this.state.board[cell][chipSize] = {
      color: this.getPlayer(playerName).color,
      player: playerName,
    }

    const player = this.getPlayer(playerName);
    player.chips[chipSize] -= 1;

    this.state.playerMove += 1;
    this.state.playerMove %= this.state.playersPosition.length;

    if(this.isOver()){
      player.score += 1
      this.state.winner = playerName;
    }

    this.update();
  }

  isOver = () => {
    const board = this.state.board;
    for(let i = 0; i < 3; i += 1){
      // check row
      if(this.checkCells([board[i*3], board[i*3+1], board[i*3+2]])){
        return true
      }

      // check col
      if(this.checkCells([board[i], board[i+3], board[i+6]])){
        return true;
      }
    }

    // check diagonals
    if(this.checkCells([board[0], board[4], board[8]]) ||
      this.checkCells([board[2], board[4], board[6]])
    ){
      return true;
    }

    return this.state.board.find(this.checkCell);
  }

  checkCells = (cells) => {
    const finished = ['small', 'medium', 'large'].find((size) => {
      if(!cells[0][size]){
        return false
      }

      if(cells[0][size].player === cells[1][size]?.player &&
        cells[0][size].player === cells[2][size]?.player
      ){
        return true;
      }
    });

    if(finished){
      return true;
    }

    if(
      cells[0].large &&
      cells[0].large.player === cells[1].medium?.player &&
      cells[0].large.player === cells[2].small?.player
    ){
      return true;
    }

    if(
      cells[0].small &&
      cells[0].small.player === cells[1].medium?.player &&
      cells[0].small.player === cells[2].large?.player
    ){
      return true;
    }

    return false;
  }

  checkCell = (cell) => {
    if(
      cell.large &&
      cell.large.player === cell.medium?.player &&
      cell.large.player === cell.small?.player
    ) {
      return true
    }

    return false;
  };

  reset = () => {
    const players = Object.entries(this.state.players);

    Game.rooms[this.roomCode] = Game.getNewState();
    const newGame = new Game(this.roomCode);
    newGame.state.queen = this.state.queen;

    players.forEach(([playerName, oldPlayer]) => {
      newGame.addPlayer(playerName);
      newGame.state.players[playerName].color = oldPlayer.color;
      newGame.state.players[playerName].score = oldPlayer.score;
    })

    this.update();
  }

  setColor = (playerName, color) => {
    this.validatePlayer(playerName);
    this.validateNotStarted();
    this.validateCanUseColor(color);

    const player = this.getPlayer(playerName);
    player.color = color;

    this.update();
  }
}

module.exports = Game;