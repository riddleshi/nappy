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
        `To wake up not feeling like a zombie at ${formatTime(hour, minute)}, it is recommended to go to bed at one of the following times:\n\n` +
        results.slice(0, 4).join('\n') + `\n`+
        `\nIf you hate yourself, you may also choose one of the following times:\n\n` +
        [results[4], results[5], results[6], results[7]].join('\n') + `\n`+
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
        results.slice(0, 4).join('\n') + `\n`+
        `\nIf you hate yourself, you may also choose one of the following times:\n\n` +
        [results[4], results[5], results[6], results[7]].join('\n') + `\n`+
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
        onClick={() => setNightMode(n => !n)}
        title={nightMode ? 'Day mode' : 'Night mode'}
      >
        {nightMode ? '☀️' : '🌙'}
      </button>
      <div className="form-container sleep-goal-form-container">
        <h2>Sleep Goal</h2>
        <button
          className={`average-btn${nightMode ? ' night' : ''} sleep-goal-btn`}
          onClick={fetchGoal}
        >
          Show Current Sleep Goal
        </button>
        <button
          className={`average-btn${nightMode ? ' night' : ''} sleep-goal-btn`}
          onClick={() => { setEditMode(true); setShowGoal(false); setMessage(''); }}
        >
          Edit Sleep Goal
        </button>
        <button
          className={`average-btn${nightMode ? ' night' : ''} sleep-goal-btn`}
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
                className={`average-btn${nightMode ? ' night' : ''} sleep-goal-btn${goal === opt ? ' goal-option-selected' : ''}`}
                style={{
                  marginBottom: '0.5rem'
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
          <div className={`sleep-calculator-box${nightMode ? ' night' : ''}`}>
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