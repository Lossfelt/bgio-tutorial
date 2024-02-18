import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';
import React from 'react';
import './Board.css';
import { Lobby } from 'boardgame.io/react';

const App = () => {

    return (
        <div className='center-content'>
            <Lobby
                gameServer={`http://${window.location.hostname}:8000`}
                lobbyServer={`http://${window.location.hostname}:8000`}
                gameComponents={[
                    { game: TicTacToe, board: TicTacToeBoard, }
                ]}
            />
        </div>
    );

};

export default App;