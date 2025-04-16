import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScoreBoard from './ScoreBoard';
import ScoringControls from './ScoringControls';
import BattingCard from './BattingCard';
import BowlingCard from './BowlingCard';
import { getMatch, updateMatch } from '../services/api';
import '../styles/scoreboard.css';

function LiveMatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBatsmen, setCurrentBatsmen] = useState([null, null]);
  const [currentBowler, setCurrentBowler] = useState(null);
  const [strikerIndex, setStrikerIndex] = useState(0); // 0 or 1, indicates which batsman is on strike
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  
  // Selection modes
  const [selectionMode, setSelectionMode] = useState(null); // 'initial', 'newBatsman', 'newBowler'
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMatch(matchId);
        const matchData = response.data;
        setMatch(matchData);
        
        // Check if we need to select players (first time starting)
        const battingTeamKey = matchData.currentTeam;
        if (!matchData[battingTeamKey].currentBatsmen || 
            matchData[battingTeamKey].currentBatsmen.length !== 2) {
          setShowPlayerSelection(true);
          setSelectionMode('initial');
        } else {
          setupPlayers(matchData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [matchId]);

  const setupPlayers = (matchData) => {
    const battingTeamKey = matchData.currentTeam;
    const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
    
    // Setup batsmen
    if (matchData[battingTeamKey].currentBatsmen && 
        matchData[battingTeamKey].currentBatsmen.length === 2) {
      setCurrentBatsmen(matchData[battingTeamKey].currentBatsmen);
      setStrikerIndex(0); // Assuming first batsman is on strike
    }
    
    // Setup bowler
    if (matchData[bowlingTeamKey].currentBowler !== undefined) {
      setCurrentBowler(matchData[bowlingTeamKey].currentBowler);
    }
  };

  const handlePlayerSelection = async () => {
    if (!match) return;
    const battingTeamKey = match.currentTeam;
    const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
    
    // Clone match to avoid direct state mutation
    const updatedMatch = JSON.parse(JSON.stringify(match));
    
    if (selectionMode === 'initial') {
      // Initial selection - both batsmen and bowler
      const batsman1Index = parseInt(document.getElementById('batsman1').value);
      const batsman2Index = parseInt(document.getElementById('batsman2').value);
      const bowlerIndex = parseInt(document.getElementById('bowler').value);
      
      if (batsman1Index === batsman2Index) {
        alert('You must select two different batsmen');
        return;
      }
      
      setCurrentBatsmen([batsman1Index, batsman2Index]);
      setCurrentBowler(bowlerIndex);
      
      updatedMatch[battingTeamKey].currentBatsmen = [batsman1Index, batsman2Index];
      updatedMatch[bowlingTeamKey].currentBowler = bowlerIndex;
    } 
    else if (selectionMode === 'newBatsman') {
      // New batsman selection after wicket
      const newBatsmanIndex = parseInt(document.getElementById('newBatsman').value);
      const existingBatsmanIndex = currentBatsmen[1 - strikerIndex];
      
      if (newBatsmanIndex === existingBatsmanIndex) {
        alert('This player is already batting');
        return;
      }
      
      // Replace the out batsman with the new one
      const newBatsmen = [...currentBatsmen];
      newBatsmen[strikerIndex] = newBatsmanIndex;
      
      setCurrentBatsmen(newBatsmen);
      updatedMatch[battingTeamKey].currentBatsmen = newBatsmen;
    } 
    else if (selectionMode === 'newBowler') {
      // New bowler selection after end of over
      const newBowlerIndex = parseInt(document.getElementById('newBowler').value);
      
      setCurrentBowler(newBowlerIndex);
      updatedMatch[bowlingTeamKey].currentBowler = newBowlerIndex;
    }
    
    try {
      await updateMatch(matchId, updatedMatch);
      setMatch(updatedMatch);
      setShowPlayerSelection(false);
      setSelectionMode(null);
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleInningsEnd = (updatedMatch) => {
    const battingTeamKey = updatedMatch.currentTeam;
    
    if (battingTeamKey === 'team1') {
      // First innings complete
      updatedMatch.currentTeam = 'team2';
      updatedMatch.currentInnings = 2;
      
      // Show player selection for second innings
      setSelectionMode('initial');
      setShowPlayerSelection(true);
    } else {
      // Match complete
      updatedMatch.status = 'completed';
      
      // Add result
      const team1Score = updatedMatch.team1.score;
      const team2Score = updatedMatch.team2.score;
      
      if (team1Score > team2Score) {
        updatedMatch.result = {
          winner: updatedMatch.team1.name,
          margin: team1Score - team2Score,
          marginType: 'runs'
        };
      } else if (team2Score > team1Score) {
        updatedMatch.result = {
          winner: updatedMatch.team2.name,
          margin: updatedMatch.team2.players.length - 1 - updatedMatch.team2.wickets,
          marginType: 'wickets'
        };
      } else {
        updatedMatch.result = {
          winner: 'Match tied'
        };
      }
      
      // Navigate to summary
      updateMatch(matchId, updatedMatch).then(() => {
        navigate(`/summary/${matchId}`);
      });
    }
  };

  const handleBallOutcome = async (outcome) => {
    if (!match) return;
    
    // Clone match to avoid direct state mutation
    const updatedMatch = JSON.parse(JSON.stringify(match));
    const battingTeamKey = match.currentTeam;
    const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
    
    // Get references to current batsmen and bowler
    const strikerPlayerIndex = currentBatsmen[strikerIndex];
    const nonStrikerPlayerIndex = currentBatsmen[1 - strikerIndex];
    
    // Process the outcome based on its type
    switch (outcome.type) {
      case 'retire':
        // Show retire selection dialog
        setSelectionMode('retire');
        setShowPlayerSelection(true);
        return; // Exit early
      case 'runs':
        // Update batsman stats
        updatedMatch[battingTeamKey].players[strikerPlayerIndex].runs += outcome.value;
        updatedMatch[battingTeamKey].players[strikerPlayerIndex].ballsFaced += 1;
        
        if (outcome.value === 4) {
          updatedMatch[battingTeamKey].players[strikerPlayerIndex].fours += 1;
        } else if (outcome.value === 6) {
          updatedMatch[battingTeamKey].players[strikerPlayerIndex].sixes += 1;
        }
        
        // Update team stats
        updatedMatch[battingTeamKey].score += outcome.value;
        updatedMatch[battingTeamKey].balls += 1;
        
        // Update bowler stats
        updatedMatch[bowlingTeamKey].players[currentBowler].ballsBowled += 1;
        updatedMatch[bowlingTeamKey].players[currentBowler].runsConceded += outcome.value;
        
        // Change strike if odd number of runs
        if (outcome.value % 2 === 1) {
          setStrikerIndex(1 - strikerIndex);
        }
        
        break;
        
      case 'wide':
        // Wide adds 1 run but no ball is counted against the batsman
        updatedMatch[battingTeamKey].score += 1;
        updatedMatch[battingTeamKey].extras += 1;
        
        // Update bowler stats
        updatedMatch[bowlingTeamKey].players[currentBowler].runsConceded += 1;
        
        break;
        
      case 'noball':
        // No ball adds 1 run but doesn't count as a ball
        updatedMatch[battingTeamKey].score += 1;
        updatedMatch[battingTeamKey].extras += 1;
        
        // Update bowler stats
        updatedMatch[bowlingTeamKey].players[currentBowler].runsConceded += 1;
        
        break;
        
      case 'bye':
      case 'legbye':
        // Add runs without crediting the batsman
        const extraRuns = outcome.value || 1;
        updatedMatch[battingTeamKey].score += extraRuns;
        updatedMatch[battingTeamKey].extras += extraRuns;
        updatedMatch[battingTeamKey].balls += 1;
        
        // Count as a ball faced
        updatedMatch[battingTeamKey].players[strikerPlayerIndex].ballsFaced += 1;
        
        // Update bowler stats
        updatedMatch[bowlingTeamKey].players[currentBowler].ballsBowled += 1;
        
        // Change strike if odd number of runs
        if (extraRuns % 2 === 1) {
          setStrikerIndex(1 - strikerIndex);
        }
        
        break;
        
      case 'wicket':
        // Handle wicket
        updatedMatch[battingTeamKey].wickets += 1;
        updatedMatch[battingTeamKey].balls += 1;
        updatedMatch[battingTeamKey].players[strikerPlayerIndex].ballsFaced += 1;
        
        // Update bowler stats
        updatedMatch[bowlingTeamKey].players[currentBowler].ballsBowled += 1;
        updatedMatch[bowlingTeamKey].players[currentBowler].wickets += 1;
        
        try {
          await updateMatch(matchId, updatedMatch);
          setMatch(updatedMatch);
          
          // Check if all batsmen are out
          if (updatedMatch[battingTeamKey].wickets < updatedMatch[battingTeamKey].players.length - 1) {
            // Prompt for new batsman selection
            setSelectionMode('newBatsman');
            setShowPlayerSelection(true);
            return; // Exit early to prevent double API call
          } else {
            // All out, end innings
            handleInningsEnd(updatedMatch);
          }
        } catch (error) {
          console.error('Error updating match:', error);
        }
        
        break;
        
      case 'endOver':
        // First check if it's a full over
        if (updatedMatch[battingTeamKey].balls % 6 !== 0) {
          alert("Cannot end over before 6 balls are bowled");
          return;
        }
        
        // End of over, change bowler and switch strike
        setStrikerIndex(1 - strikerIndex); // Switch strike at end of over
        
        try {
          await updateMatch(matchId, updatedMatch);
          setMatch(updatedMatch);
          
          // Prompt for new bowler selection
          setSelectionMode('newBowler');
          setShowPlayerSelection(true);
          return; // Exit early to prevent double API call
        } catch (error) {
          console.error('Error updating match:', error);
        }
        
        break;

      case 'changeStrike':
        // Manually change strike
        setStrikerIndex(1 - strikerIndex);
        break;
        
      default:
        console.warn('Unhandled outcome type:', outcome.type);
        return;
    }
    
    // Add the ball to ball-by-ball record
    updatedMatch.ballByBall.push({
      innings: updatedMatch.currentInnings,
      over: Math.floor(updatedMatch[battingTeamKey].balls / 6),
      ball: updatedMatch[battingTeamKey].balls % 6 || 6,
      batsman: updatedMatch[battingTeamKey].players[strikerPlayerIndex].name,
      bowler: updatedMatch[bowlingTeamKey].players[currentBowler].name,
      outcome: outcome,
      timestamp: new Date()
    });
    
    try {
      // Send the updated match to the server
      const response = await updateMatch(matchId, updatedMatch);
      
      // Update local state with the response data
      setMatch(response.data);
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading match data...</div>;
  }

  if (!match) {
    return <div className="error">Match not found</div>;
  }

  const battingTeamKey = match.currentTeam;
  const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
  const battingTeam = match[battingTeamKey];
  const bowlingTeam = match[bowlingTeamKey];

  // Render player selection UI based on selection mode
// Render player selection UI based on selection mode
  if (showPlayerSelection) {
    return (
      <div className="player-selection">
        <h1>{selectionMode === 'initial' ? 'Select Players' : 
            selectionMode === 'newBatsman' ? 'Select New Batsman' : 
            'Select New Bowler'}</h1>
        
        <div className="selection-container">
          {selectionMode === 'initial' && (
            <>
              <div className="selection-section">
                <h2>Select Batsmen for {battingTeam.name}</h2>
                <div className="form-group">
                  <label>First Batsman (Striker)</label>
                  <select id="batsman1" className="player-select">
                    {battingTeam.players.map((player, index) => (
                      <option key={index} value={index}>{player.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Second Batsman (Non-striker)</label>
                  <select id="batsman2" className="player-select" defaultValue="1">
                    {battingTeam.players.map((player, index) => (
                      <option key={index} value={index}>{player.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="selection-section">
                <h2>Select Bowler for {bowlingTeam.name}</h2>
                <div className="form-group">
                  <label>Bowler</label>
                  <select id="bowler" className="player-select">
                    {bowlingTeam.players.map((player, index) => (
                      <option key={index} value={index}>{player.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          
          {selectionMode === 'newBatsman' && (
            <div className="selection-section">
              <h2>Select New Batsman for {battingTeam.name}</h2>
              <p>Current batsmen: {battingTeam.players[currentBatsmen[0]]?.name}, {battingTeam.players[currentBatsmen[1]]?.name}</p>
              <p>Out: {battingTeam.players[currentBatsmen[strikerIndex]]?.name}</p>
              <div className="form-group">
                <label>New Batsman</label>
                <select id="newBatsman" className="player-select">
                  {battingTeam.players.map((player, index) => {
                    // Don't show current batsmen as options
                    if (currentBatsmen.includes(index)) return null;
                    return (
                      <option key={index} value={index}>{player.name}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
          
          {selectionMode === 'newBowler' && (
            <div className="selection-section">
              <h2>Select New Bowler for {bowlingTeam.name}</h2>
              <p>Previous bowler: {bowlingTeam.players[currentBowler]?.name}</p>
              <div className="form-group">
                <label>New Bowler</label>
                <select id="newBowler" className="player-select">
                  {bowlingTeam.players.map((player, index) => (
                    <option key={index} value={index}>{player.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={handlePlayerSelection}
        >
          {selectionMode === 'initial' ? 'Start Match' : 'Confirm Selection'}
        </button>
      </div>
    );
  }

  // Main match UI - this is what should show after player selection
  return (
    <div className="live-match">
      <h1>{battingTeam.name} vs {bowlingTeam.name}</h1>
      
      <div className="match-info">
        <p>Venue: {match.settings.venue}</p>
        <p>Match Type: {match.settings.matchType}</p>
        <p>Overs: {match.settings.overs}</p>
      </div>
      
      <ScoreBoard 
        match={match} 
        battingTeam={battingTeam}
        currentBatsmen={currentBatsmen}
        currentBowler={currentBowler}
        strikerIndex={strikerIndex}
      />
      
      <div className="scoring-section">
        <ScoringControls onBallOutcome={handleBallOutcome} />
      </div>
      
      <div className="stats-section">
        <BattingCard team={battingTeam} />
        <BowlingCard team={bowlingTeam} />
      </div>
    </div>
  );
}

export default LiveMatch;