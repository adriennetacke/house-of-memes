import { Button } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';

function HostPage() {
  const { gameId } = useParams();

  const handleNextRound = () => {

  }

  return (
    <div>
      Host for Game: {gameId}
      <Button onClick={handleNextRound}>Start Next Round</Button>
    </div>
  );
}

export default HostPage;
