import './Board.css'
import React, { useState, useEffect } from 'react';

export function TicTacToeBoard({ ctx, G, moves, matchData, playerID, isActive }) {

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

  //lokal state for å håndtere bruk av strategiske våpen
  const [specialMoveActive, setSpecialMoveActive] = useState(false);
  const [targetsOfSpecialMove, setTargetsOfSpecialMove] = useState([]);
  //funksjon for når en spiller aktiverer et strategisk våpen
  const handleSpecialMoveClick = () => {
    if (!specialMoveActive) {
      setSpecialMoveActive(G.MWD[playerID]);
    } else {
      setSpecialMoveActive(false);
      setTargetsOfSpecialMove([]);
    }
  };
  //Legg til en ID som mål for strategisk våpen
  const specialAttack = (id) => {
    setTargetsOfSpecialMove((targetsOfSpecialMove) => {
      const newTargets = [...targetsOfSpecialMove, id];
      return newTargets;
    })
  }
  //Bruk av strategisk våpen
  useEffect(() => {
    if (specialMoveActive === "Air Strike" && targetsOfSpecialMove.length === 3) {
      moves.MWD(targetsOfSpecialMove, matchData);
      setTargetsOfSpecialMove([]);
      setSpecialMoveActive(false);
    }
    if (specialMoveActive === "Artillery" && targetsOfSpecialMove.length === 1) {
      moves.MWD(targetsOfSpecialMove[0], matchData);
      setTargetsOfSpecialMove([]);
      setSpecialMoveActive(false);
    }
  }, [targetsOfSpecialMove, specialMoveActive, moves, matchData]);

  //funksjon for å klikke på de vanlige cellene
  const clickCell = (id) => {
    if (specialMoveActive) {
      specialAttack(id);
    }
    else {
      moves.clickCell(id, matchData);
    }
  };

  let winner = '';
  if (ctx.gameover) {
    winner = (
      <div id="winner">Winner: {ctx.gameover.winner === "0" ? ("☢") : ("☣")}</div>
    );
  }

  let tbody = [];
  for (let i = 0; i < 4; i++) {
    let cells = [];
    for (let j = 0; j < 4; j++) {
      const id = 4 * i + j;
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <button className={blinking[id] ? ("knapp blink") : ("knapp")} type='button' onClick={() => clickCell(id)} onAnimationEnd={() => handleAnimationEnd(id)}>{G.cells[id] === "0" ? ("☢") : ("☣")}</button>
          ) : (
            <button className={blinking[id] ? ("knapp blink") : ("knapp")} type='button' onClick={() => clickCell(id)} onAnimationEnd={() => handleAnimationEnd(id)} />
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
        <button
          style={specialMoveActive ? { backgroundColor: "red" } : {}}
          onClick={() => handleSpecialMoveClick()}
          disabled={!isActive}>{G.MWD[playerID]}</button>
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