import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Index() {
  return (
    <div className="page-background home-bg ">
      <h1>Nappy</h1> 
      <Link to="/login">Login</Link> |
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Index;