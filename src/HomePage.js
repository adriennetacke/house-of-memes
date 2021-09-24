import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      background: 'repeating-linear-gradient(to right, rgba(115, 169, 255, 0.4), rgba(115, 169, 255, 0.4) 100px, #fffef6 100px, #fffef6 200px)',
      height: '100vh'}}>

      <Typography variant="h1" style={{
        fontFamily: 'Fleur De Leah', 
        color: 'gold', 
        textShadow: '2px 2px #000000'}}>
        House of Memes
      </Typography>
      <Typography variant="h3" style={{
        fontFamily: 'Fleur De Leah', 
        color: 'black', 
        fontWeight: 500,
        textShadow: '1px 1px 3px #000000'}}>
        <i> Cleverness creates champions</i>
      </Typography>
      <br/>
      
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        width: '60%', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: 20}}>

        <Card sx={{ display: 'flex', maxWidth: 800 }}>
          <CardContent>
            <Typography variant="body">
              <b>Ever see a painting and think, "That's exactly what our retrospectives look like: tiring, useless, and painful"? 😂</b>
            </Typography>
            <br/>
            <br/>
            <Typography variant="body">
              Put that clever mind to use! This game is straightforward: a host selects a random piece of art, other players submit their funniest, tech-related caption, and then the host chooses the winner! Create a new game to be the host or Join an existing game by entering it's game ID. Happy memeing!
            </Typography>
          </CardContent>
        </Card>
        <br/>
        <b>Start from scratch!</b>

        <Button 
          onClick={handleCreateGame}
          variant="contained"
          style={{marginBottom: 20}}
        >
          Create New Game
        </Button>

        or

        <Divider />

        <b>Join Game</b> (enter existing game ID):
        <div style={{display: 'flex', alignItems: "flex-end"}}>
          <TextField
            type="text"
            onChange={handleGameIdChange}
            value={gameId}
            variant="standard"
            style={{marginTop: 20}}
          />
          <Button onClick={handleJoinGame} variant="contained">Join</Button>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;
