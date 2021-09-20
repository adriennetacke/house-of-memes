import { Button, Divider, TextField } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router';
import { useRealmApp } from './RealmApp';

function HomePage() {
  const [gameId, setGameId] = React.useState('');
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

    history.push(`/game/${gameId}`);
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
