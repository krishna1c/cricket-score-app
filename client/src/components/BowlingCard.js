import React from 'react';

function BowlingCard({ team }) {
  return (
    <div className="bowling-card">
      <h3>Bowling - {team.name}</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Overs</th>
            <th>Runs</th>
            <th>Wickets</th>
            <th>Economy</th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((player, index) => (
            player.ballsBowled > 0 && (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{Math.floor(player.ballsBowled/6)}.{player.ballsBowled % 6}</td>
                <td>{player.runsConceded || 0}</td>
                <td>{player.wickets || 0}</td>
                <td>
                  {player.ballsBowled ? 
                    ((player.runsConceded / (player.ballsBowled/6)) || 0).toFixed(2) : 
                    "0.00"
                  }
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BowlingCard;