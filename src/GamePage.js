import React from 'react';
import { useParams } from 'react-router';

function GamePage() {
  const { gameId } = useParams();

  return (
    <div>
      Game: {gameId}
    </div>
  );
}

export default GamePage;
