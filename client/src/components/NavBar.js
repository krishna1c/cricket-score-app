import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="nav-logo">Cricket Scorer</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">New Match</Link>
          <Link to="/matches" className="nav-link">Matches</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;