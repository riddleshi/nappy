import React, { useState } from 'react';
import '../App.css';

function SleepGoal() {
  const [nightMode, setNightMode] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [goal, setGoal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcMode, setCalcMode] = useState(null); // 'wake' or 'bed'
  const [calcTime, setCalcTime] = useState('');
  const [calcResults, setCalcResults] = useState(null);

  const fetchGoal = async () => {
    setMessage('');
    setShowGoal(true);
    setEditMode(false);
    const res = await fetch('http://localhost:8080/sleep-goal', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setGoal(data.sleep_goal_hours);
    } else {
      setGoal(null);
      setMessage('Could not fetch sleep goal.');
    }
  };

  // Update sleep goal in backend
  const updateGoal = async (newGoal) => {
    setMessage('');
    const res = await fetch('http://localhost:8080/sleep-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sleep_goal_hours: newGoal })
    });
    if (res.ok) {
      setGoal(newGoal);
      setEditMode(false);
      setShowGoal(true);
      setMessage('Sleep goal updated!');
    } else {
      setMessage('Failed to update sleep goal.');
    }
  };

  function handleCalculate() {
    if (!calcTime) return;
    const [hour, minute] = calcTime.split(':').map(Number);
    let base = new Date();
    base.setHours(hour, minute, 0, 0);

    const cycles = [7, 6, 5, 4, 3, 2, 1];
    const results = [];

    if (calcMode === 'wake') {
      // Subtract cycles
      for (let i = 0; i < cycles.length; i++) {
        let d = new Date(base);
        d.setMinutes(d.getMinutes() - (cycles[i] * 90 + 15));
        results.push(`${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${cycles[i]} sleep cycles)`);
      }
      setCalcResults(
        `To wake up not feeling like a zombie at ${formatTime(hour, minute)}, it is recommended go to bed at one of the following times:\n\n` +
        results.slice(2, 5).join('\n') + `\n`+
        `\nIf you have different arrangements, you may also choose one of the following times:\n\n` +
        [results[0], results[1], results[5], results[6]].join('\n') + `\n`+
        `\nThese times are calculated assuming you take 15 minutes to drift off while overthinking life. Waking up in between 90-minute sleep cycles helps avoid feeling like you got hit by a bus. Aim for 5–6 cycles unless you enjoy emotional instability and caffeine dependency.`
      );
    } else if (calcMode === 'bed') {
      // Add cycles
      for (let i = 0; i < cycles.length; i++) {
        let d = new Date(base);
        d.setMinutes(d.getMinutes() + (cycles[i] * 90 + 15));
        results.push(`${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${cycles[i]} sleep cycles)`);
      }
      setCalcResults(
        `If you crash into bed at ${formatTime(hour, minute)}, you are advised to get up at one of the following times for a non-zombie experience:\n\n` +
        results.slice(2, 5).join('\n') + `\n`+
        `\nIf you have different arrangements, you may also choose one of the following times:\n\n` +
        [results[0], results[1], results[5], results[6]].join('\n') + `\n`+
        `\nThese times are calculated assuming you take 15 minutes to drift off while overthinking life. Waking up in between 90-minute sleep cycles helps avoid feeling like you got hit by a bus. Aim for 5–6 cycles unless you enjoy emotional instability and caffeine dependency.`
      );
    }
  }

  function formatTime(hour, minute) {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className={`page-background sleep-goal-bg${nightMode ? ' night' : ''}`}>
      <button
        className="night-mode-btn"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#222',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'background 0.2s, transform 0.2s'
        }}
        onClick={() => setNightMode(n => !n)}
        title={nightMode ? 'Day mode' : 'Night mode'}
      >
        {nightMode ? '☀️' : '🌙'}
      </button>
      <div className="form-container" style={{ minWidth: 320, maxWidth: 400, marginTop: '2rem' }}>
        <h2>Sleep Goal</h2>
        <button
          className={`average-btn${nightMode ? ' night' : ''}`}
          style={{ width: '100%' }}
          onClick={fetchGoal}
        >
          Show Current Sleep Goal
        </button>
        <button
          className={`average-btn${nightMode ? ' night' : ''}`}
          style={{ width: '100%' }}
          onClick={() => { setEditMode(true); setShowGoal(false); setMessage(''); }}
        >
          Edit Sleep Goal
        </button>
        <button
          className={`average-btn${nightMode ? ' night' : ''}`}
          style={{ width: '100%' }}
          onClick={() => { setShowCalculator(true); setCalcMode(null); setCalcTime(''); setCalcResults(null); }}
        >
          Sleep Cycle Calculator
        </button>

        {/* Show current goal */}
        {showGoal && goal && (
          <div style={{ marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Your Goal is to sleep {goal} hours everyday!
          </div>
        )}
        {/* Edit mode */}
        {editMode && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '0.7rem' }}>Choose your new sleep goal:</div>
            {[6, 7, 8, 9, 10].map(opt => (
              <button
                key={opt}
                className={`average-btn${nightMode ? ' night' : ''}`}
                style={{
                  width: '100%',
                  marginBottom: '0.5rem',
                  background: goal === opt ? '#4a90e2' : undefined
                }}
                onClick={() => updateGoal(opt)}
              >
                {opt} hours
              </button>
            ))}
          </div>
        )}
        {message && (
          <div style={{ marginTop: '1rem', color: '#357ab8', fontWeight: 'bold' }}>{message}</div>
        )}

        {showCalculator && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '10px',
            background: nightMode ? '#1a2740' : '#e0eafc',
            color: nightMode ? '#e0eafc' : '#07213f',
            fontSize: '1.2rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <button
                style={{ marginRight: '1rem' }}
                onClick={() => { setCalcMode('wake'); setCalcResults(null); }}
              >
                I want to wake up at
              </button>
              <button
                onClick={() => { setCalcMode('bed'); setCalcResults(null); }}
              >
                I want to go to bed at
              </button>
            </div>
            {calcMode && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleCalculate();
                }}
              >
                <input
                  type="time"
                  value={calcTime}
                  onChange={e => setCalcTime(e.target.value)}
                  required
                />
                <button type="submit" style={{ marginLeft: '1rem' }}>Calculate</button>
              </form>
            )}
            {calcResults && (
              <div style={{ marginTop: '1rem', whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
                {calcResults}
              </div>
            )}
            <button
              style={{ marginTop: '1rem', background: '#aaa', color: '#fff' }}
              onClick={() => setShowCalculator(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SleepGoal;