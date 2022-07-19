
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

class GameNotStartedError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'The game has not started yet. Patience is the best weapon.';
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

class NotPlayerTurnError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'It is not your turn yet.';
    }
};

class InvalidCellError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'Can\'t make a move there.';
    }
};

class InvalidChipError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'Invalid chip. What game are you playing?';
    }
};

class InvalidPlayerChipError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'Player is out of these chips.';
    }
};

class GameEndedError extends Error {
    constructor(message) {
        super(message);
        this.message = message ?? 'The game is already over.';
    }
};


module.exports = {
    InvalidRoomError,
    GameInProgressError,
    DuplicatePlayerNameError,
    PlayerLimitReachedError,
    PlayerDoesNotExistError,
    InvalidCellError,
    InvalidChipError,
    InvalidPlayerChipError,
    GameNotStartedError,
    NotPlayerTurnError,
    GameEndedError,
}