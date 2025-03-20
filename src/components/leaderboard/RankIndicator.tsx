
import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface RankIndicatorProps {
  rank: number;
}

const RankIndicator: React.FC<RankIndicatorProps> = ({ rank }) => {
  return (
    <>
      {rank === 0 && (
        <Trophy className="h-5 w-5 text-yellow-500 inline mr-1" />
      )}
      {rank === 1 && (
        <Medal className="h-5 w-5 text-gray-400 inline mr-1" />
      )}
      {rank === 2 && (
        <Medal className="h-5 w-5 text-amber-600 inline mr-1" />
      )}
      {rank + 1}
    </>
  );
};

export default RankIndicator;
