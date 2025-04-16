import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamSetup from './TeamSetup';
import { createMatch, getPlayers, addPlayers } from '../services/api';
import '../styles/components.css';

function GameSetup() {
  const navigate = useNavigate();
  const [matchSettings, setMatchSettings] = useState({
    overs: 20,
    venue: '',
    matchType: 'T20',
    umpires: '',
  });
  const [team1, setTeam1] = useState({ name: 'Team A', players: [] });
  const [team2, setTeam2] = useState({ name: 'Team B', players: [] });
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [requiredPlayers, setRequiredPlayers] = useState(11);
  const [showAddPlayersForm, setShowAddPlayersForm] = useState(false);
  const [newPlayerNames, setNewPlayerNames] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await getPlayers();
      setAvailablePlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setMatchSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  const assignPlayers = async () => {
    const totalPlayersNeeded = requiredPlayers * 2;
    const currentPlayers = [...team1.players, ...team2.players];
    const remainingPlayersNeeded = totalPlayersNeeded - currentPlayers.length;
    
    if (availablePlayers.length >= remainingPlayersNeeded) {
      // Randomly assign players
      const shuffledPlayers = [...availablePlayers].sort(() => 0.5 - Math.random());
      const team1Needed = requiredPlayers - team1.players.length;
      const team2Needed = requiredPlayers - team2.players.length;
      
      const team1NewPlayers = shuffledPlayers.slice(0, team1Needed);
      const team2NewPlayers = shuffledPlayers.slice(team1Needed, team1Needed + team2Needed);
      
      setTeam1((prev) => ({
        ...prev,
        players: [...prev.players, ...team1NewPlayers],
      }));
      
      setTeam2((prev) => ({
        ...prev,
        players: [...prev.players, ...team2NewPlayers],
      }));
      
      const usedPlayers = [...team1NewPlayers, ...team2NewPlayers];
      setAvailablePlayers((prev) =>
        prev.filter((player) => !usedPlayers.includes(player))
      );
    } else {
      setShowAddPlayersForm(true);
    }
  };
  
  const addNewPlayers = async (e) => {
    e.preventDefault();
    
    if (!newPlayerNames.trim()) {
      alert('Please enter player names');
      return;
    }
    
    // Convert comma-separated names to player objects
    const playerNames = newPlayerNames.split(',').map(name => name.trim()).filter(name => name);
    const newPlayers = playerNames.map(name => ({
      name,
      role: 'batsman',
      battingStyle: 'right-handed',
      bowlingStyle: '',
      runs: 0,
      ballsFaced: 0,
      wickets: 0,
      ballsBowled: 0,
      runsConceded: 0
    }));
    
    if (newPlayers.length === 0) {
      alert('No valid player names entered');
      return;
    }
    
    try {
      const response = await addPlayers(newPlayers);
      setAvailablePlayers(prev => [...prev, ...response.data]);
      setNewPlayerNames('');
      setShowAddPlayersForm(false);
      
      // If we still need to assign players, do it now
      const totalPlayersNeeded = requiredPlayers * 2;
      const currentPlayers = [...team1.players, ...team2.players];
      if (currentPlayers.length < totalPlayersNeeded) {
        assignPlayers();
      }
    } catch (error) {
      console.error('Error adding players:', error);
      alert('Failed to add players');
    }
  };
  
  const startMatch = async () => {
    try {
      // Check if each team has the required number of players
      if (team1.players.length < requiredPlayers || team2.players.length < requiredPlayers) {
        alert(`Each team must have at least ${requiredPlayers} players.`);
        return;
      }
      
      const matchData = {
        settings: matchSettings,
        team1,
        team2,
        currentInnings: 1,
        currentTeam: 'team1',
        status: 'in_progress',
        date: new Date(),
        ballByBall: [], // Initialize empty ball-by-ball data
      };
      
      const response = await createMatch(matchData);
      navigate(`/match/${response.data._id}`);
    } catch (error) {
      console.error('Error starting match:', error);
      alert('Failed to start match');
    }
  };

  return (
    <div className="game-setup">
      <h1>Cricket Match Setup</h1>
      
      <div className="match-settings">
        <h2>Match Settings</h2>
        <div className="form-group">
          <label>Overs</label>
          <input
            type="number"
            name="overs"
            value={matchSettings.overs}
            onChange={handleSettingsChange}
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            name="venue"
            value={matchSettings.venue}
            onChange={handleSettingsChange}
          />
        </div>
        
        <div className="form-group">
          <label>Match Type</label>
          <select name="matchType" value={matchSettings.matchType} onChange={handleSettingsChange}>
            <option value="T20">T20</option>
            <option value="ODI">ODI</option>
            <option value="Test">Test</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Number of Players per Team</label>
          <input
            type="number"
            value={requiredPlayers}
            onChange={(e) => setRequiredPlayers(Number(e.target.value))}
            min="2"
            max="11"
          />
        </div>
      </div>
      
      <div className="teams-container">
        <TeamSetup 
          team={team1} 
          setTeam={setTeam1} 
          title="Team 1" 
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
        />
        <TeamSetup 
          team={team2} 
          setTeam={setTeam2} 
          title="Team 2"
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
        />
      </div>
      
      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={assignPlayers}>
          Auto-Assign Players
        </button>
        <button className="btn btn-primary" onClick={startMatch}>
          Start Match
        </button>
      </div>
      
      {showAddPlayersForm && (
        <div className="add-players-form">
          <h3>Add More Players</h3>
          <p>Need {(requiredPlayers * 2) - (team1.players.length + team2.players.length)} more players</p>
          <form onSubmit={addNewPlayers}>
            <div className="form-group">
              <label>Enter player names (comma-separated)</label>
              <textarea
                value={newPlayerNames}
                onChange={(e) => setNewPlayerNames(e.target.value)}
                placeholder="John Doe, Jane Smith, etc."
                rows="4"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add Players</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddPlayersForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GameSetup;