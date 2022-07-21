const GameBase = require('./base');
const exceptions = require('./exceptions');

class GameValidation extends GameBase {
  static validateRoomCode = (roomCode) => {
    if(!roomCode || !(roomCode in this.rooms)){
      throw new exceptions.InvalidRoomError();
    }
  }

  validateNotStarted = () => {
    if(this.state.inProgress) {
        throw new exceptions.GameInProgressError();
    }
  }

  validateStarted = () => {
    if(!this.state.inProgress) {
        throw new exceptions.GameNotStartedError();
    }
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

  validatePlayersLimit = () => {
    if(Object.keys(this.state.players).length > this.state.maxPlayers){
        throw new exceptions.PlayerLimitReachedError();
    }
  }

  validatePlayerChip = (playerName, chipSize) => {
    this.validatePlayer(playerName);
    this.validateChipSize(chipSize);

    const player = this.getPlayer(playerName);
    if(player.chips[chipSize] <= 0) {
      throw new exceptions.InvalidPlayerChipError();
    }
  }

  validatePlayerTurn = (playerName) => {
    this.validateStarted();
    this.validatePlayer(playerName);

    if(this.state.playersPosition[this.state.playerMove] !== playerName){
      throw new exceptions.NotPlayerTurnError();
    }
  }

  validateChipSize = (chipSize) => {
    if(!(['small', 'medium', 'large'].includes(chipSize))){
      throw new exceptions.InvalidChipError();
    }
  }

  validateCellAction = (cell, chipSize) => {
    if(cell < 0 || cell > 8){
      throw new exceptions.InvalidCellError();
    }

    if(this.state.board[cell][chipSize]){
      throw new exceptions.InvalidCellError();
    }
  }

  validateNoWinners = () => {
    if(this.state.winner){
      throw new exceptions.GameEndedError();
    }
  }

  validateIsQueen = (playerName) => {
    if(this.state.queen !== playerName){
      throw new Error('You are not the queen, but a jester.')
    }
  }
}

module.exports = GameValidation;