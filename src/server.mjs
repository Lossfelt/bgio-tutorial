import { Server } from 'boardgame.io/dist/cjs/server.js';
import { TicTacToe } from './Game.js';
import cors from '@koa/cors';
import { nanoid } from 'nanoid';

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

const PORT = process.env.PORT || 8000;

server.app.middleware.unshift(cors());

server.run(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});