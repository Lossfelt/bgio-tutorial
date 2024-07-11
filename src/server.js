const {Server} = require('boardgame.io/server');
const {TicTacToe} = require('./Game');
const cors = require('@koa/cors');
const { nanoid } = require('nanoid');

const server = Server({
    games: [TicTacToe],
    uuid: () => {
        const matchID = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(`Generated match ID: ${matchID}`);
        return matchID;
    },
    generateCredentials: () => {
        const credentials = nanoid();
        console.log(`Generated credentials: ${credentials}`);
        return credentials;
        },
});

server.app.middleware.unshift(cors());

server.run(8000,()=>{console.log("server is running...")});