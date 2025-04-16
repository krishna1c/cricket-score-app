import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import GameSetup from './GameSetup';
import LiveMatch from './LiveMatch';
import MatchSummary from './MatchSummary';
import Matches from './Matches';
import { MatchProvider } from '../context/MatchContext';
import '../styles/main.css';

function App() {
  return (
    <Router>
      <MatchProvider>
        <div className="app-container">
          <NavBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<GameSetup />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/match/:matchId" element={<LiveMatch />} />
              <Route path="/summary/:matchId" element={<MatchSummary />} />
            </Routes>
          </div>
        </div>
      </MatchProvider>
    </Router>
  );
}

export default App;