import { INVALID_MOVE } from "boardgame.io/core";

//names of the different squares of the board
const territories = [
  "The Northwestern Mountains", 
  "The Northern Tundra", 
  "The Northwestern Reaches", 
  "The Western Islands",
  "The Central Plains", 
  "The Eastern Urban Ruins", 
  "The Southwestern Desert",
  "The Southern River Delta",
  "The Southeastern Jungle",
];

const strategic_weapons = [
  "Artillery",
  "Air Strike",
];

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = row => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
//endre denne til å bli Strategic Assets Unlocked når alle celler er fulle
/* function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
} */

// Define the rules of the game
export const TicTacToe = {
  name: 'TicTacToe',

  setup: () => {
    return { 
    cells: Array(9).fill(null), 
    log: [],
    blink: Array(9).fill(false),
    lastCellAttacked: null,
    MWD: Array(2).fill(null),
  }},

  turn: {
    minMoves: 1,
    maxMoves: 1,
    onBegin: ({G, ctx, random}) => {
      G.lastCellAttacked = null;
      G.MWD[ctx.currentPlayer] = strategic_weapons[random.Die(strategic_weapons.length) - 1];
      //console.log(G.MWD[ctx.currentPlayer]);
    },
    onEnd: ({G, random}) => {
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] !== null && random.Number() < 0.1 && i !== G.lastCellAttacked) {
          G.cells[i] = null;
          G.log.unshift(`The people of ${territories[i]} revolt against foreign rule`);
          G.blink[i] = true;
        }
      }
    },
  },

  moves: {
    clickCell: ({ G, playerID, random }, id, matchData) => {
      G.blink.fill(false);
      if (G.cells[id] === playerID) {
        return INVALID_MOVE;
      }
      else if (G.cells[id] !== null) {
        if (random.Number() < 0.2) {
          G.cells[id] = playerID;
          G.log.unshift(`${matchData[playerID].name} conquers ${territories[id]}`);
        }
        else {
          G.log.unshift(`${matchData[playerID].name} attempts to invade ${territories[id]}, but fails`);
        }
        G.blink[id] = true;
        G.lastCellAttacked = id;
      }
      else {
        G.cells[id] = playerID;
        G.log.unshift(`${matchData[playerID].name} claims ${territories[id]}`);
        G.blink[id] = true;
        G.lastCellAttacked = id;
      }
    },
    MWD: ({ G, playerID }, id, matchData) => {
      //todo: implement MWD
    },
  },

  minPlayers: 2,
  maxPlayers: 2,

  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    /* if (IsDraw(G.cells)) {
      return { draw: true };
    } */
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },
};