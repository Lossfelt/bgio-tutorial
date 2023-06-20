import { Client } from 'boardgame.io/react';
import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';
import { SocketIO } from 'boardgame.io/multiplayer';
import React, { useState } from 'react';
import './Board.css';

const TicTacToeClient = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
    multiplayer: SocketIO({ server: '192.168.4.24:8000' }),
});

const App = () => {

    const [playerchoice, setPlayerchoice] = useState(null);
    const handlePlayerchoice = (key) => {
        setPlayerchoice(key);
    };

    return (
        <div className='multiplayer'>
            {playerchoice ? (<TicTacToeClient playerID={playerchoice} />) : 
            (<div><button onClick={() => handlePlayerchoice('0')}>Player 0</button> <button onClick={() => handlePlayerchoice('1')}>Player 1</button></div>)}
        </div>
    );

};

export default App;