import './Board.css'
import React, { useState, useEffect, useRef } from 'react';

// Funksjon for å sjekke om to objekter er like
const deepEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export function TicTacToeBoard({ ctx, G, moves, matchData, playerID, isActive }) {

  // Lokal state for å lagre G.blink
  const [blinking, setBlinking] = useState(G.blink);
  // Lagre en referanse til forrige G for å sammenligne
  const previousGRef = useRef(G);
  // Oppdater lokal state når G.blink endres, men bare hvis G faktisk har blitt oppdatert
  useEffect(() => {
    const previousG = previousGRef.current;

    if (!deepEqual(G.blink, previousG.blink)) {
      // G har blitt oppdatert
      setBlinking(G.blink);
      previousGRef.current = G; // Oppdater referansen
    }
  }, [G]);
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
    if (specialMoveActive === "Biological Warfare" && targetsOfSpecialMove.length === 1) {
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
      <div id="winner">
      Winner: {ctx.gameover.winner === "0" ? (
        <>
        {matchData[0]?.name || "Queendom"}
        <img src="/Queendom_icon.png" alt="Queendom" style={{ height: '1em', verticalAlign: 'middle' }} />
        </>
      ) : (
        <>
        {matchData[1]?.name || "Pan-Canadia"}
        <img src="/Pan-Canadia_icon.png" alt="Pan-Canadia" style={{ height: '1em', verticalAlign: 'middle' }} />
        </>
      )}
      </div>
    );
  }

  let tbody = [];
  for (let i = 0; i < 4; i++) {
    let cells = [];
    for (let j = 0; j < 4; j++) {
      const id = 4 * i + j;
      const isSelected = targetsOfSpecialMove.includes(id); // Sjekk om knappen er valgt til strategisk våpen
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
        <button className={`${blinking[id] ? "knapp blink" : "knapp"} ${
          isSelected ? "selected" : ""
        }`} type='button' onClick={() => clickCell(id)} onAnimationEnd={() => handleAnimationEnd(id)}>
          <img src={G.cells[id] === "0" ? "/Queendom_icon.png" : "/Pan-Canadia_icon.png"} alt={G.cells[id] === "0" ? "Queendom" : "Pan-Canadia"} style={{ width: '100%', height: '100%' }} />
        </button>
          ) : (
        <button className={`${blinking[id] ? "knapp blink" : "knapp"} ${
          isSelected ? "selected" : ""
        }`} type='button' onClick={() => clickCell(id)} onAnimationEnd={() => handleAnimationEnd(id)} />
          )}
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div className="container">
      <div className='center-content'>
        <h1>
          {matchData[0].name} &nbsp;
          <img src="/Queendom_icon.png" alt="Queendom" style={{ height: '1em', verticalAlign: 'middle' }} /> 
          &nbsp;vs&nbsp; 
          {matchData[1].name} &nbsp;
          <img src="/Pan-Canadia_icon.png" alt="Pan-Canadia" style={{ height: '1em', verticalAlign: 'middle' }} />
        </h1>
        <table>
          <tbody>{tbody}</tbody>
        </table>
        <h3>
          Current turn: {matchData[ctx.currentPlayer]?.name || (
            ctx.currentPlayer === "0" ? 
            <img src="/Queendom_icon.png" alt="Queendom" style={{ height: '1em', verticalAlign: 'middle' }} /> : 
            <img src="/Pan-Canadia_icon.png" alt="Pan-Canadia" style={{ height: '1em', verticalAlign: 'middle' }} />
          )}
        </h3>
        <button
          className='strategic_weapons'
          style={specialMoveActive ? { backgroundColor: "red" } : {}}
          onClick={() => handleSpecialMoveClick()}
          disabled={!isActive}>{G.MWD[playerID]}</button>
        <div>Rareium: {G.Rareium[playerID]} </div>
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