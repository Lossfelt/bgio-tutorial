import { INVALID_MOVE } from "boardgame.io/core";

// Names of the different squares of the board
const territories = [
  "the Salt Marches", 
  "the Corn Belt Desert", 
  "Hudson's Pit", 
  "Port Orchard",
  "Port Crater", 
  "the Savannah Fragments", 
  "the Ash Plains",
  "the Rust Belt Ruins",
  "Angels' Remnants",
  "Oklahoma Rift",
  "the Dusty Delta",
  "the Shining Desert",
  "the Shattered Mountains",
  "the Plains of Iron",
  "the Confederate Shards",
  "the Sunset Swamps"
];

const strategic_weapons = [
  "Artillery",
  "Air Strike",
];

// Positions for rows, columns, and diagonals
const positions = [
  // Horizontal lines
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
  // Vertical lines
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
  // Diagonal lines
  [0, 5, 10, 15], [3, 6, 9, 12]
];

// Check if `cells` is in a winning configuration
function IsVictory(cells) {
  const isRowComplete = (row, cells) => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };
  return positions.some(row => isRowComplete(row, cells));
}

// funksjon for å teste om celler er på rad, enten horisontalt, vertikalt eller diagonalt, ved Air Strike
function IsRow(input) {
  return positions.some(row => input.every(pos => row.includes(pos)));
}

// Helper function to get neighbors for Artillery
function GetNeighbors(id, boardSize = 4) {
  const neighbors = [];
  const row = Math.floor(id / boardSize);
  const col = id % boardSize;

  if (row > 0) neighbors.push(id - boardSize);       // Above
  if (row < boardSize - 1) neighbors.push(id + boardSize); // Below
  if (col > 0) neighbors.push(id - 1);              // Left
  if (col < boardSize - 1) neighbors.push(id + 1);  // Right

  return neighbors;
}

// Define the rules of the game
export const TicTacToe = {
  name: 'TicTacToe',

  setup: () => ({
    cells: Array(16).fill(null),
    log: [],
    blink: Array(16).fill(false),
    lastCellAttacked: null,
    MWD: Array(2).fill(null),
  }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
    onBegin: ({ G, ctx, random }) => {
      G.lastCellAttacked = null;
      G.MWD[ctx.currentPlayer] = strategic_weapons[random.Die(strategic_weapons.length) - 1];
    },
    onEnd: ({ G, random }) => {
      for (let i = 0; i < 16; i++) {
        if (G.cells[i] !== null && random.Number() < 0.05 && i !== G.lastCellAttacked) {
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
      } else if (G.cells[id] !== null) {
        if (random.Number() < 0.2) {
          G.cells[id] = playerID; // 20% chance of conquering
          G.log.unshift(`${matchData[playerID].name} conquers ${territories[id]}`);
        } else {
          G.log.unshift(`${matchData[playerID].name} attempts to invade ${territories[id]}, but fails`);
        }
        G.blink[id] = true;
        G.lastCellAttacked = id;
      } else {
        G.cells[id] = playerID;
        G.log.unshift(`${matchData[playerID].name} claims ${territories[id]}`);
        G.blink[id] = true;
        G.lastCellAttacked = id;
      }
    },
    MWD: ({ G, playerID }, input, matchData) => {
      if (G.MWD[playerID] === "Artillery") {
        const targets = [input, ...GetNeighbors(input)];
        targets.forEach(target => {
          G.cells[target] = null; // Destroy targeted cells
          G.blink[target] = true;
        });
        G.log.unshift(`${matchData[playerID].name} launches an Artillery Strike at ${territories[input]} and its neighbors!`);
        G.lastCellAttacked = input;
      } else if (G.MWD[playerID] === "Air Strike") {
        if (input.length === 3 && IsRow(input)) {
          G.log.unshift(`${matchData[playerID].name} launches an Air Strike at ${input.map(id => territories[id]).join(", ")}`);
          input.forEach(id => {
            G.cells[id] = null; // Destroy targeted cells
            G.blink[id] = true;
          });
          G.lastCellAttacked = input[2];
        } else {
          return INVALID_MOVE; // Allow the player to try again
        }
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
