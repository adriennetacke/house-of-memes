
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRealmApp } from './RealmApp';
import Button from '@mui/material/Button';

function HostPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [game, setGame] = useState(null);
  const [randomArtUrl, setRandomArtUrl] = useState(null);
  const [retrievingRandomArtUrl, setRetrievingRandomArtUrl] = useState(false);
  const [settingArtUrlForGame, setSettingArtUrlForGame] = useState(false);
  const [selectedRow, setSelectedRow] = useState(-1);
  const { gameId } = useParams();
  const app = useRealmApp();
  const { enableSubmissions, disableSubmissions, getRandomArtCard, setArtUrlForGame, selectWinningCaption } = app.currentUser.functions;

  useEffect(() => {
    async function subscribe() {
      console.log(`Subscribing to change stream for game ${gameId}`);
      setSubscribed(true);
      const mongodb = app.currentUser.mongoClient('mongodb-atlas');
      const gamesCollection = mongodb.db('classic-cards').collection('games');

      const game = await gamesCollection.findOne({ game_id: gameId });

      setGame(game);

      if (!randomArtUrl) {
        setRandomArtUrl(game.image_url);
      }

      const stream = gamesCollection.watch({ 'fullDocument._id': gameId });
      
      for await (const change of stream) {
        console.log('Game object updated', change);
        setGame(change.fullDocument)
      }
    }

    if (!subscribed) {
      subscribe();
    }
  }, [app]);

  const toggleSubmissions = async () => {
    if (!game.allow_submissions) {
      console.log(`Enabling submissions for game ${gameId}`);
      await enableSubmissions(gameId);
    } else {
      console.log(`Disabling submissions for game ${gameId}`);
      await disableSubmissions(gameId);
    }
  };

  const handleGetRandomArt = async () => {
    setRetrievingRandomArtUrl(true);

    const { primaryImage } = await getRandomArtCard();

    setRandomArtUrl(primaryImage);
    setRetrievingRandomArtUrl(false);
  };

  const handleSelectArt = async () => {
    setSettingArtUrlForGame(true);

    await setArtUrlForGame(gameId, randomArtUrl);

    setSettingArtUrlForGame(false);
  };

  const handleSelectWinner = async () => {
    await selectWinningCaption(gameId, game.submissions[selectedRow]);
  };

  if (!game) {
    return <div>Loading game...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'repeating-linear-gradient( to right, #fc9b90, #fc9b90 100px, #fffef6 100px, #fffef6 200px)'}}>
       <Typography variant="h1" style={{fontFamily: 'Fleur De Leah', color: 'gold', textShadow: '2px 2px #000000'}}>
          House of Memes
       </Typography>
       <Typography variant="h3" style={{fontFamily: 'Fleur De Leah', color: 'black', fontWeight: 500}}>
         <i> Cleverness creates champions</i>
       </Typography>
       <br/>

      <ToggleButton
        value="check"
        selected={game.allow_submissions}
        onChange={() => {
          toggleSubmissions();
        }}
      >
        {game.allow_submissions ? 'Disable' : 'Enable'} Submissions
      </ToggleButton>

      <br/>

      {Boolean(!game.allow_submissions) &&
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 30 }}>
          Please select an art piece

          <img style={{ border: 10, borderColor: '#CCA604', borderStyle: 'ridge', height: 500, boxShadow: '2px 2px 6px #000', marginBottom: 50 }} src={randomArtUrl} />

          <Button
            onClick={handleGetRandomArt}
            disabled={retrievingRandomArtUrl}
            variant="outlined"
          >
            Get random art piece
          </Button>
          <Button
            onClick={handleSelectArt}
            disabled={settingArtUrlForGame}
            variant="contained"
          >
            Make current art piece active
          </Button>
        </div>
      }

      
      {Boolean(game.allow_submissions) &&
        <div>
          <img style={{ border: 10, borderColor: '#CCA604', borderStyle: 'ridge', height: 500 }} src={game.image_url} />
        </div>
      }

      <div style={{marginTop: 50}}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Submissions ({game.submissions.length})</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {game.submissions.map((caption, i) => (
                  <TableRow
                    key={`row-${i}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={() => setSelectedRow(i)}
                    selected={i === selectedRow}  
                  >
                    <TableCell component="th" scope="row">{caption}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Button
          disabled={selectedRow === -1}
          onClick={handleSelectWinner}>
            Select winner
        </Button>
      </div>
      <div>
      You are the Host! Game: {gameId}
      </div>
    </div>
  );
}

export default HostPage;
