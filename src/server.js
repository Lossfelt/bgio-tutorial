const {Server, Origins} = require('boardgame.io/server');
const {TicTacToe} = require('./Game');

const server = Server({
    games: [TicTacToe],
    origins: [Origins.LOCAL_IP],
});

server.run(8000);