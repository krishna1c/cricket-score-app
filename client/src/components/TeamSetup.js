import React, { useState } from 'react';
import PlayerForm from './PlayerForm';

function TeamSetup({ team, setTeam, title, availablePlayers, setAvailablePlayers }) {
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showAvailablePlayers, setShowAvailablePlayers] = useState(false);
  
  const handleTeamNameChange = (e) => {
    setTeam({ ...team, name: e.target.value });
  };
  
  const addPlayer = (player) => {
    setTeam({
      ...team,
      players: [...team.players, player],
    });
    setShowPlayerForm(false);
  };
  
  const addExistingPlayer = (player, index) => {
    // Add to team
    setTeam({
      ...team,
      players: [...team.players, player],
    });
    
    // Remove from available players
    const updatedAvailablePlayers = [...availablePlayers];
    updatedAvailablePlayers.splice(index, 1);
    setAvailablePlayers(updatedAvailablePlayers);
    
    setShowAvailablePlayers(false);
  };
  
  const removePlayer = (index) => {
    const removedPlayer = team.players[index];
    
    // Remove from team
    const updatedPlayers = [...team.players];
    updatedPlayers.splice(index, 1);
    setTeam({ ...team, players: updatedPlayers });
    
    // Add back to available players
    setAvailablePlayers([...availablePlayers, removedPlayer]);
  };

  return (
    <div className="team-setup">
      <h2>{title}</h2>
      
      <div className="form-group">
        <label>Team Name</label>
        <input type="text" value={team.name} onChange={handleTeamNameChange} />
      </div>
      
      <h3>Players</h3>
      {team.players.length === 0 ? (
        <p>No players added yet</p>
      ) : (
        <ul className="player-list">
          {team.players.map((player, index) => (
            <li key={index} className="player-item">
              <span>{player.name} ({player.role || 'batsman'})</span>
              <button
                className="btn btn-small btn-danger"
                onClick={() => removePlayer(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {showPlayerForm ? (
        <PlayerForm onAdd={addPlayer} onCancel={() => setShowPlayerForm(false)} />
      ) : showAvailablePlayers ? (
        <div className="available-players">
          <h4>Available Players</h4>
          {availablePlayers.length === 0 ? (
            <p>No available players</p>
          ) : (
            <ul className="player-list">
              {availablePlayers.map((player, index) => (
                <li key={index} className="player-item">
                  <span>{player.name} ({player.role || 'batsman'})</span>
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => addExistingPlayer(player, index)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAvailablePlayers(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="player-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowPlayerForm(true)}
          >
            Create New Player
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowAvailablePlayers(true)}
          >
            Add Existing Player
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamSetup;