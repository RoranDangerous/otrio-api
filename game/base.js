const { updateGameState } = require('../utils/events');
const { getRandomColor } = require('../utils/random');

const rooms = {};

class GameBase {
  state = null;
  roomCode = null;

  constructor(roomCode = null) {
    if(roomCode){
      this.constructor.validateRoomCode(roomCode);
      this.roomCode = roomCode;
      this.state = rooms[roomCode];
    }
  }

  static validateRoomCode = () => {
    throw new Error('Not Implemented');
  }

  static getNewState = (playerName) => {
    return {
      inProgress: false,
      queen: playerName,
      maxPlayers: 4,
      playersPosition: null,
      playerMove: 0,
      board: Array(9).fill().map(() => GameBase.getNewCellState()),
      players: {
        [playerName]: GameBase.getNewPlayerState()
      }
    }
  }

  static getNewCellState = () => ({
    small: null,
    medium: null,
    large: null,
  })

  static getNewPlayerState = (existingColors = []) => ({
    score: 0,
    color: getRandomColor(existingColors),
    connected: true,
    chips: {
      small: 3,
      medium: 3,
      large: 3,
    }
  })

  static roomExists = (roomCode) => roomCode in rooms;

  static get rooms () {
    return rooms
  };

  playerExists = (playerName) => playerName in this.state.players;

  getPlayer (playerName) {
    if(this.playerExists(playerName)){
      return this.state.players[playerName];
    }
    return null;
  }

  isAdmin = (playerName) => this.state.queen === playerName;

  update = () => updateGameState(this.roomCode);
}

module.exports = GameBase;