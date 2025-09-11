import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SleepChart from './SleepChart';
import AverageSleep from './AverageSleep';

function Home() {
  const [date, setDate] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showAverage, setShowAverage] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const navigate = useNavigate();


  const fetchLogs = (month = '') => {
    let url = 'http://localhost:8080/home/sleeplogs';
    if (month) url += `?month=${month}`;
    fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    fetchLogs(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
   

    // Create a Date object from the selected date 
    const [year, month, day] = date.split('-').map(Number);
    let wakeDateObj = new Date(year, month - 1, day);

  
    wakeDateObj.setHours(wakeHour);
    wakeDateObj.setMinutes(wakeMin);

    // Use the selected date as the "sleep log date" (the date you went to bed)
    const sleepDateISO = date; // already in YYYY-MM-DD format

    const res = await fetch('http://localhost:8080/home/sleeplogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date: sleepDateISO, sleep_time: sleepTime, wake_time: wakeTime, mood })
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
    <div className={`page-background home-bg${nightMode ? ' night' : ''}`}>
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

        <button onClick={() => setShowChart(!showChart)}>
          Visualize your sleep history
        </button>
        {showChart && (
          <>
            <label>
              Select Month:&nbsp;
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              />
            </label>
            <SleepChart logs={logs} />
          </>
        )}
        <button
          className="average-btn"
          onClick={() => setShowAverage(!showAverage)}
        >
          Average sleep per month
        </button>
        {showAverage && <AverageSleep logs={logs} />}
<button
  className={`sleep-goal-btn${nightMode ? ' night' : ''}`}
  onClick={() => navigate('/sleep-goal')}
>
  Sleep Goals
</button>
<button
  className={`sleep-goal-btn${nightMode ? ' night' : ''}`}
  onClick={() => navigate('/dream-journal')}
>
  Dream Journal
</button>
      </div>
      <img src="/cloud.webp" className="cloud" alt="moving cloud" />
      <button
  className="night-mode-btn"
  onClick={() => setNightMode(n => !n)}
  title={nightMode ? 'Day mode' : 'Night mode'}
>
  {nightMode ? '☀️' : '🌙'}
</button>
    </div>
  );
}

export default Home;