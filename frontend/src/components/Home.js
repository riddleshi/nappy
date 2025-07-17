import React, { useState, useEffect } from 'react';

function Home() {
  const [date, setDate] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);


  useEffect(() => {
    fetch('http://localhost:8080/home/sleeplogs', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/home/sleeplogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date, sleep_time: sleepTime, wake_time: wakeTime, mood })
    });
    if (res.ok) {
      setMessage('Sleep log added!');
      const updatedLogs = await fetch('http://localhost:8080/home/sleeplogs', { credentials: 'include' })
        .then(res => res.json());
      setLogs(updatedLogs.logs || []);
    } else {
      setMessage('Failed to add sleep log.');
    }
  };

  return (
    <div className="page-background home-bg">
      <div className="form-container">
        <h2>Log Your Sleep</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required /><br/>
          <label>Sleep Time:</label>
          <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} required /><br/>
          <label>Wake Time:</label>
          <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} required /><br/>
          <label>Mood:</label>
          <input type="text" value={mood} onChange={e => setMood(e.target.value)} /><br/>
          <button type="submit">Add Sleep Log</button>
        </form>
        {message && <div>{message}</div>}
        <h3>Your Sleep Logs</h3>
        <ul>
          {logs.map(log => (
            <li key={log.sleeplog_id}>
              {log.date}: {log.sleep_time} - {log.wake_time} | Mood: {log.mood}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;