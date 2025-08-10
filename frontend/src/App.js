import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Index from './components/Index';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; 
import SleepGoal from './components/SleepGoal';
import DreamJournal from './components/DreamJournal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/log-in" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path='/sleep-goal' element={<SleepGoal />}/>
        <Route path="/dream-journal" element={<DreamJournal />} />
      </Routes>
    </Router>
  );
}

export default App;

