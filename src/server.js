const {Server, Origins} = require('boardgame.io/server');
const {TicTacToe} = require('./Game');
const cors = require('@koa/cors');

const server = Server({
    games: [TicTacToe],
});

server.app.middleware.unshift(cors());

server.run(8000,()=>{console.log("server is running...")});