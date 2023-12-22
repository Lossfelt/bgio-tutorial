import { Client } from 'boardgame.io/react';
import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';
import { SocketIO } from 'boardgame.io/multiplayer';
import React, { useState } from 'react';
import './Board.css';
import { Lobby } from 'boardgame.io/react';

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
        <div className='center-content'>
            {/* {playerchoice ? (<TicTacToeClient playerID={playerchoice} />) :
                (<div><button onClick={() => handlePlayerchoice('0')}>Player 0</button> <button onClick={() => handlePlayerchoice('1')}>Player 1</button></div>)} */}
            <Lobby
                gameServer={`http://${window.location.hostname}:8000`}
                lobbyServer={`http://${window.location.hostname}:8000`}/* Previous adress: https://192.168.4.24:8000 */
                gameComponents={[
                    { game: TicTacToe, board: TicTacToeBoard, }
                ]}
            />
        </div>
    );

};

export default App;