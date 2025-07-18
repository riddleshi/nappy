import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Index() {
  return (
    <div className="page-background index-bg">
      <div className="index-container">
        <h1 className="nappy-logo">Nappy</h1>
        <div className="index-buttons">
          <Link to="/log-in" className="index-btn">Login</Link>
          <Link to="/register" className="index-btn">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Index;