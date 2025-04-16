import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMatch } from '../services/api';

function MatchSummary() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await getMatch(matchId);
        setMatch(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match:', error);
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) {
    return <div className="loading">Loading match summary...</div>;
  }

  if (!match) {
    return <div className="error">Match not found</div>;
  }

  return (
    <div className="match-summary">
      <h1>Match Summary</h1>
      
      <div className="result-banner">
        {match.result ? match.result.winner + " won by " + match.result.margin + " " + match.result.marginType : "Match completed"}
      </div>
      
      <div className="stats-container">
        <div className="team-stats">
          <h2>{match.team1.name}</h2>
          <p>Score: {match.team1.score}/{match.team1.wickets}</p>
          <p>Overs: {Math.floor(match.team1.balls/6)}.{match.team1.balls % 6}</p>
        </div>
        
        <div className="team-stats">
          <h2>{match.team2.name}</h2>
          <p>Score: {match.team2.score}/{match.team2.wickets}</p>
          <p>Overs: {Math.floor(match.team2.balls/6)}.{match.team2.balls % 6}</p>
        </div>
      </div>
    </div>
  );
}

export default MatchSummary;