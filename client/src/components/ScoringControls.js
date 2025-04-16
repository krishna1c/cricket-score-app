import React, { useState } from 'react';

function ScoringControls({ onBallOutcome }) {
  const [extraRunsMode, setExtraRunsMode] = useState(null);
  const runButtons = [0, 1, 2, 3, 4, 6];
  
  const handleExtraRuns = (type, runs) => {
    onBallOutcome({ type, value: runs });
    setExtraRunsMode(null);
  };
  
  return (
    <div className="scoring-controls">
      {extraRunsMode ? (
        <div className="extra-runs-modal">
          <h3>{extraRunsMode} Runs</h3>
          <div className="run-buttons">
            {runButtons.map(runs => (
              <button 
                key={runs} 
                className="score-btn"
                onClick={() => handleExtraRuns(extraRunsMode, runs)}
              >
                {runs}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setExtraRunsMode(null)}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="control-section">
            <h3>Runs</h3>
            <div className="run-buttons">
              {runButtons.map(runs => (
                <button 
                  key={runs} 
                  className="score-btn"
                  onClick={() => onBallOutcome({ type: 'runs', value: runs })}
                >
                  {runs}
                </button>
              ))}
            </div>
          </div>
          
          <div className="control-section">
            <h3>Extras</h3>
            <div className="extra-buttons">
              <button className="score-btn" onClick={() => onBallOutcome({ type: 'wide', value: 1 })}>Wide</button>
              <button className="score-btn" onClick={() => onBallOutcome({ type: 'noball', value: 1 })}>No Ball</button>
              <button className="score-btn" onClick={() => setExtraRunsMode('bye')}>Bye</button>
              <button className="score-btn" onClick={() => setExtraRunsMode('legbye')}>Leg Bye</button>
            </div>
          </div>
          
          <div className="control-section">
            <h3>Wickets</h3>
            <div className="wicket-buttons">
              <button className="score-btn wicket" onClick={() => onBallOutcome({ type: 'wicket', dismissal: 'bowled' })}>Bowled</button>
              <button className="score-btn wicket" onClick={() => onBallOutcome({ type: 'wicket', dismissal: 'caught' })}>Caught</button>
              <button className="score-btn wicket" onClick={() => onBallOutcome({ type: 'wicket', dismissal: 'lbw' })}>LBW</button>
              <button className="score-btn wicket" onClick={() => onBallOutcome({ type: 'wicket', dismissal: 'runout' })}>Run Out</button>
              <button className="score-btn wicket" onClick={() => onBallOutcome({ type: 'wicket', dismissal: 'stumped' })}>Stumped</button>
            </div>
          </div>
          
          <div className="control-section">
            <h3>Actions</h3>
            <div className="action-buttons">
              <button className="score-btn action" onClick={() => onBallOutcome({ type: 'endOver' })}>End Over</button>
              <button className="score-btn action" onClick={() => onBallOutcome({ type: 'changeStrike' })}>Change Strike</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ScoringControls;