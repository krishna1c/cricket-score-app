import React, { useState } from 'react';

function PlayerForm({ onAdd, onCancel }) {
  const [player, setPlayer] = useState({
    name: '',
    role: 'batsman',
    battingStyle: 'right-handed',
    bowlingStyle: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!player.name) {
      alert('Player name is required');
      return;
    }
    onAdd({
      ...player,
      runs: 0,
      ballsFaced: 0,
      wickets: 0,
      ballsBowled: 0,
      runsConceded: 0
    });
  };

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input 
          type="text" 
          name="name" 
          value={player.name} 
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Role</label>
        <select name="role" value={player.role} onChange={handleChange}>
          <option value="batsman">Batsman</option>
          <option value="bowler">Bowler</option>
          <option value="all-rounder">All-Rounder</option>
          <option value="wicket-keeper">Wicket-Keeper</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Batting Style</label>
        <select name="battingStyle" value={player.battingStyle} onChange={handleChange}>
          <option value="right-handed">Right-Handed</option>
          <option value="left-handed">Left-Handed</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Bowling Style</label>
        <input 
          type="text" 
          name="bowlingStyle" 
          value={player.bowlingStyle} 
          onChange={handleChange}
          placeholder="e.g., Off-Spin, Fast Medium"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Add Player
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default PlayerForm;

