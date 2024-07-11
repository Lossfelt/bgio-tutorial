import React from 'react';
import './Board.css'

export function TicTacToeBoard({ ctx, G, moves, matchData }) {
  const onClick = (id) => {
    moves.clickCell(id, matchData);
  };

  let winner = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner === "0" ? ("☢") : ("☣")}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  let tbody = [];
  for (let i = 0; i < 3; i++) {
    let cells = [];
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j;
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <button className='knapp' type='button'>{G.cells[id] === "0" ? ("☢") : ("☣")}</button>
          ) : (
            <button className='knapp' type='button' onClick={() => onClick(id)} />
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div className="container">
      <div className='center-content'>
        <table>
          <tbody>{tbody}</tbody>
        </table>
        <div className='text'>
          {winner}
        </div>
        <div className='gameLog'>
          <h2>Game Log</h2>
          <ul>
          {G.log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
}