import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../services/api';
import '../styles/components.css';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await getMatches();
        setMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className="loading">Loading matches...</div>;
  }

  return (
    <div className="matches-container">
      <h1>Cricket Matches</h1>
      
      {matches.length === 0 ? (
        <p>No matches found. Create a new match to get started.</p>
      ) : (
        <div className="matches-list">
          {matches.map(match => (
            <div key={match._id} className="match-card">
              <div className="match-header">
                <h3>{match.team1.name} vs {match.team2.name}</h3>
                <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
              </div>
              
              <div className="match-details">
                <p>Venue: {match.settings.venue || 'Not specified'}</p>
                <p>Type: {match.settings.matchType}</p>
                <p>Overs: {match.settings.overs}</p>
                <p>Status: {match.status === 'completed' ? 'Completed' : 'In Progress'}</p>
              </div>
              
              <div className="match-scores">
                <div className="team-score">
                  <p>{match.team1.name}: {match.team1.score}/{match.team1.wickets}</p>
                  <p>Overs: {Math.floor((match.team1.balls || 0) / 6)}.{(match.team1.balls || 0) % 6}</p>
                </div>
                
                <div className="team-score">
                  <p>{match.team2.name}: {match.team2.score}/{match.team2.wickets}</p>
                  <p>Overs: {Math.floor((match.team2.balls || 0) / 6)}.{(match.team2.balls || 0) % 6}</p>
                </div>
              </div>
              
              <div className="match-actions">
                {match.status === 'in_progress' ? (
                  <Link to={`/match/${match._id}`} className="btn btn-primary">Continue Match</Link>
                ) : (
                  <Link to={`/summary/${match._id}`} className="btn btn-secondary">View Summary</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="centered-button">
        <Link to="/" className="btn btn-primary">New Match</Link>
      </div>
    </div>
  );
}

export default Matches;