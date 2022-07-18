const exceptions = require('./exceptions');
const { updateGameState } = require('../utils/events');
const random = require('../utils/random');

const rooms = {};

class Game {
  state = null;
  roomCode = null;

  constructor(roomCode = null) {
    if(roomCode){
      Game.validateRoomCode(roomCode);
      this.roomCode = roomCode;
      this.state = rooms[roomCode];
    }
  }

  static validateRoomCode = (roomCode) => {
    if(!roomCode || !(roomCode in rooms)){
      throw new exceptions.InvalidRoomError();
    }
  }

  validateNotStarted = () => {
    if(this.state.inProgress) {
        throw new exceptions.GameInProgressError();
    }
  }

  static create = (playerName) => {
    // Tries generating unique 4-letter code
    // Stops at 100 attempts
    let tries = 0;

    while (tries < 100) {
      tries += 1;
      const code = random.generateRoomCode();

      if (code in rooms) {
        continue;
      }

      rooms[code] = {
        inProgress: false,
        queen: playerName,
        maxPlayers: 4,
        playersPosition: null,
        players: {
          [playerName]: Game.getPlayerState()
        }
      }

      return code;
    }
  }

  static getPlayerState = () => ({
    score: 0,
    color: 'blue',
    connected: true,
    units: {
      small: 2,
      medium: 2,
      large: 2,
    }
  })

  addPlayer = (playerName) => {
    this.validateUniquePlayerName(playerName);
    this.validatePlayersLimit();

    this.state.players[playerName] = Game.getPlayerState();
  }

  validateUniquePlayerName = (playerName) => {
    if(this.playerExists(playerName)) {
        throw new exceptions.DuplicatePlayerNameError();
    }
  }

  validatePlayer = (playerName) => {
    if(!this.playerExists(playerName)){
      throw new exceptions.PlayerDoesNotExistError();
    }
  }

  playerExists = (playerName) => playerName in this.state.players;

  validatePlayersLimit = () => {
    if(Object.keys(this.state.players).length > this.state.maxPlayers){
        throw new exceptions.PlayerLimitReachedError();
    }
  }

  updatePlayerConnection = (playerName, connected) => {
    this.validatePlayer(playerName);

    this.state.players[playerName].connected = connected;

    if(!connected && !this.state.inProgress){
      delete this.state.players[playerName];
    }

    const allDisconnected = Object.values(this.state.players).reduce((i, j) => i && !j.connected, true);
    if(allDisconnected){
      delete rooms[this.roomCode];
    }
  }

  isAdmin = (playerName) => this.state.queen === playerName;

  start = () => {
    this.state.inProgress = true;
    this.state.playersPosition = random.shuffle(Object.keys(this.state.players));
    updateGameState(this.roomCode);
  }
}

module.exports = Game;