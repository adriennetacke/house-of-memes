import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { useRealmApp } from './RealmApp';

function GamePage() {
  const [subscribed, setSubscribed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caption, setCaption] = useState('');
  const [game, setGame] = useState({});
  const { gameId } = useParams();
  const app = useRealmApp();
  const { submitCaption } = app.currentUser.functions;

  useEffect(() => {
    async function subscribe() {
      console.log(`Subscribing to change stream for game ${gameId}`);
      setSubscribed(true);
      const mongodb = app.currentUser.mongoClient('mongodb-atlas');
      const gamesCollection = mongodb.db('classic-cards').collection('games');

      const game = await gamesCollection.findOne({ game_id: gameId });

      setGame(game);

      const stream = gamesCollection.watch({ 'fullDocument._id': gameId });
      
      for await (const change of stream) {
        console.log('Game object updated', change);
        setGame(change.fullDocument)
      }
    }

    if (!subscribed) {
      subscribe();
    }
  }, [app, gameId, subscribed]);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleSubmitCaption = async () => {
    try {
      await submitCaption(gameId, caption);
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      background: 'repeating-linear-gradient( to right, rgba(115, 169, 255, 0.4), rgba(115, 169, 255, 0.4) 100px, #fffef6 100px, #fffef6 200px)',
      height: '100vh'}}>
       <Typography variant="h1" style={{fontFamily: 'Fleur De Leah', color: 'gold', textShadow: '2px 2px #000000'}}>
          House of Memes
       </Typography>
       <Typography variant="h3" style={{fontFamily: 'Fleur De Leah', color: 'black', fontWeight: 500}}>
         <i> Cleverness creates champions</i>
       </Typography>
      <br />
      {Boolean(game.allow_submissions) && Boolean(game.image_url) &&
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 30 }}>
          <img style={{ border: 10, borderColor: '#CCA604', borderStyle: 'ridge', height: 500, marginBottom: 50 }} src={game.image_url} />


          <Card sx={{ width: 420 }}>
            <CardContent>
              <Typography variant="body" color="text.secondary">
                <b>Caption this art piece:</b>
              </Typography>
              <TextField fullWidth 
                onChange={handleCaptionChange} 
                value={caption} 
                disabled={submitted}
                label="Enter a funny, tech-related caption..." 
                variant="outlined" 
                style={{marginTop: 20}}
              />
            </CardContent>
          </Card>

          <Button 
            variant="contained" 
            disabled={submitted} 
            onClick={handleSubmitCaption}
            style={{marginTop: 20, marginBottom: 20}}
          >
            Submit caption
          </Button>
        </div>
      }

      {Boolean(!game.allow_submissions) && Boolean(!game.image_url) &&
        <div>
          <Typography component="p">
            Host is selecting an image. Please stand by!
          </Typography>
        </div>
      }

      {Boolean(!game.allow_submissions) && Boolean(game.image_url) &&
        <div>
          <img style={{ border: 10, borderColor: '#CCA604', borderStyle: 'ridge', height: 500 }} src={game.image_url} />

          {Boolean(!game.winning_caption) && (
            <Typography component="p">
              Host is selecting a winner. Please stand by!
            </Typography>)}

          {Boolean(game.winning_caption) && (
            <Card sx={{ width: 420 }}>
              <CardContent>
                <Typography variant="h4" color="text.secondary" gutterBottom>
                  {game.winning_caption}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  <i>Anonymous</i>
                </Typography>
                <Typography variant="body2">
                San Cristóbal de La Laguna, Spain
                </Typography>
                <Typography variant="body2">
                 Canarias JS 2022
                </Typography>
              </CardContent>
            </Card>)}
        </div>
      }
    </div>
  );
}

export default GamePage;
