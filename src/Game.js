import { INVALID_MOVE } from "boardgame.io/core";

//names of the different squares of the board
const territories = [
  "Salt Marches", 
  "Corn Belt Desert", 
  "Hudson's Pit", 
  "Port Orchard",
  "Port Crater", 
  "Savannah Fragments", 
  "Ash Plains",
  "Rust Belt Ruins",
  "Angels' Remnants",
  "Oklahoma Rift",
  "Dusty Delta",
  "Shining Desert",
  "Shattered Mountains",
  "Plains of Iron",
  "Confederate Shards",
  "Sunset Swamps"
];

const strategic_weapons = [
  "Artillery",
  "Air Strike",
];

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const positions = [
    // Horisontale linjer
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
    // Vertikale linjer
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
    // Diagonale linjer
    [0, 5, 10, 15], [3, 6, 9, 12]
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
    cells: Array(16).fill(null), 
    log: [],
    blink: Array(16).fill(false),
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
      for (let i = 0; i < 16; i++) {
        if (G.cells[i] !== null && random.Number() < 0.05 && i !== G.lastCellAttacked) {
          G.cells[i] = null;
          G.log.unshift(`The people of ${territories[i]} revolt against foreign rule`); //5% chance of revolt
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
          G.cells[id] = playerID; //20% chance of conquering
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
      if (G.MWD[playerID] === "Artillery") {
        G.log.unshift(`${matchData[playerID].name} launches an artillery strike`);
        G.lastCellAttacked = id;
      }
      else if (G.MWD[playerID] === "Air Strike") {
        G.log.unshift(`${matchData[playerID].name} launches an air strike`);
        G.lastCellAttacked = id;
      }
    },
  },

  minPlayers: 2,
  maxPlayers: 2,

  endIf: ({ G, ctx }) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 16; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  },
};