const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

const updateGameState = (code) => eventEmitter.emit('update', code);

const onGameStateUpdate = (fn) => eventEmitter.on('update', fn);

module.exports = {
    eventEmitter,
    updateGameState,
    onGameStateUpdate
}