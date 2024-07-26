import './Board.css'
import React, { useState, useEffect } from 'react';

export function TicTacToeBoard({ ctx, G, moves, matchData, playerID }) {
  
  // Lokal state for å lagre G.blink
  const [blinking, setBlinking] = useState(G.blink);
  // Oppdater lokal state når G.blink endres
  useEffect(() => {
    setBlinking(G.blink);
  }, [G.blink]);
  // Funksjon for å håndtere slutten av animasjonen og fjerne blink
  const handleAnimationEnd = (id) => {
    setBlinking((blinking) => {
    const newBlinking = [...blinking];
    newBlinking[id] = false;
    return newBlinking;
    });
  };

  const onClick = (id) => {
    moves.clickCell(id, matchData);
  };


  let winner = ''; //her må jeg endre koden, ettersom det ikke er mulig med Draw som resultat
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
            <button className={blinking[id] ? ("knapp blink") : ("knapp")} type='button' onClick={() => onClick(id)} onAnimationEnd={() => handleAnimationEnd(id)}>{G.cells[id] === "0" ? ("☢") : ("☣")}</button>
          ) : (
            <button className={blinking[id] ? ("knapp blink") : ("knapp")} type='button' onClick={() => onClick(id)} onAnimationEnd={() => handleAnimationEnd(id)}/>
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div className="container">
      <div className='center-content'>
        <h1>{matchData[0].name}☢ vs {matchData[1].name}☣</h1>
        <table>
          <tbody>{tbody}</tbody>
        </table>
        <h3>Current turn: {ctx.currentPlayer === "0" ? ("☢") : ("☣")}</h3>
        <button >{G.MWD[playerID]}</button>
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