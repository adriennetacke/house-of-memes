import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useRealmApp } from './RealmApp';

function HomePage() {
  const [gameId, setGameId] = useState('');
  const history = useHistory();
  const app = useRealmApp();
  const { createGame } = app.currentUser.functions;

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGame = () => {
    history.push(`/game/${gameId}`);
  };

  const handleCreateGame = async () => {
    const { gameId } = await createGame();

    history.push(`/game/${gameId}/host`);
  };

  return (
    <div>
      House of Memes - Home
      
      Create Game
      <Button onClick={handleCreateGame}>Create</Button>

      <Divider />

      Join Game
      <TextField
        type="text"
        onChange={handleGameIdChange}
        value={gameId}
      />
      <Button onClick={handleJoinGame}>Join</Button>
    </div>
  );
}

export default HomePage;
