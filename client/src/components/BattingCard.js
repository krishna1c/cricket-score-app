import React from 'react';

function BattingCard({ team }) {
  return (
    <div className="batting-card">
      <h3>Batting - {team.name}</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>SR</th>
            <th>4s</th>
            <th>6s</th>
          </tr>
        </thead>
        <tbody>
          {team.players.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              <td>{player.runs || 0}</td>
              <td>{player.ballsFaced || 0}</td>
              <td>
                {player.ballsFaced ? 
                  ((player.runs / player.ballsFaced) * 100).toFixed(2) : 
                  "0.00"
                }
              </td>
              <td>{player.fours || 0}</td>
              <td>{player.sixes || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BattingCard;