import React from 'react';

function ScoreBoard({ match, battingTeam, currentBatsmen, currentBowler, strikerIndex }) {
  const battingTeamKey = match.currentTeam;
  const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
  const bowlingTeam = match[bowlingTeamKey];

  // Calculate overs as whole overs and remaining balls
  const overs = Math.floor(battingTeam.balls / 6);
  const balls = battingTeam.balls % 6;
  
  // Get current batsmen
  const striker = battingTeam.players[currentBatsmen[strikerIndex]];
  const nonStriker = battingTeam.players[currentBatsmen[1 - strikerIndex]];
  
  // Get current bowler
  const bowler = bowlingTeam.players[currentBowler];

  return (
    <div className="score-board">
      <div className="team-score">
        <h2>{battingTeam.name}: {battingTeam.score}/{battingTeam.wickets}</h2>
        <p>Overs: {overs}.{balls} / {match.settings.overs}</p>
        <p>CRR: {battingTeam.balls > 0 ? ((battingTeam.score / battingTeam.balls) * 6).toFixed(2) : '0.00'}</p>
      </div>
      
      <div className="batsmen">
        <h3>Batsmen</h3>
        <div className="batsman">
          <span className="batsman-name">{striker.name} *</span>
          <span className="batsman-stats">{striker.runs} ({striker.ballsFaced})</span>
        </div>
        <div className="batsman">
          <span className="batsman-name">{nonStriker.name}</span>
          <span className="batsman-stats">{nonStriker.runs} ({nonStriker.ballsFaced})</span>
        </div>
      </div>
      
      <div className="bowler">
        <h3>Bowler</h3>
        <div className="bowler-stats">
          <span className="bowler-name">{bowler.name}</span>
          <span className="bowler-figures">
            {Math.floor(bowler.ballsBowled / 6)}.{bowler.ballsBowled % 6} - {bowler.maidens} - {bowler.runsConceded} - {bowler.wickets}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;