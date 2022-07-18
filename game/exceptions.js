
class InvalidRoomError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'She gave you the wrong number, buddy!';
    }
};

class GameInProgressError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'The game has already started. I guess they didn\'t want to wait for you, eh?';
    }
};

class PlayerDoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'You are not in the game. Are you lost?';
    }
};

class DuplicatePlayerNameError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'Player with this name is already inside. Who are you?';
    }
};

class PlayerLimitReachedError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'The game is full. Hurry up next time!';
    }
};


module.exports = {
    InvalidRoomError,
    GameInProgressError,
    DuplicatePlayerNameError,
    PlayerLimitReachedError,
    PlayerDoesNotExistError,
}