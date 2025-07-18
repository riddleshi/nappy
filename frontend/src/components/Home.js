import React, { useState, useEffect } from 'react';
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

    // Parse times as minutes since midnight
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const sleepMinutes = sleepHour * 60 + sleepMin;
    const wakeMinutes = wakeHour * 60 + wakeMin;

    // Create a Date object from the selected date 
    const [year, month, day] = date.split('-').map(Number);
    let wakeDateObj = new Date(year, month - 1, day);

    // If wake time is less than sleep time, it's the next day
    if (wakeMinutes <= sleepMinutes) {
      wakeDateObj.setDate(wakeDateObj.getDate() + 1);
    }
    wakeDateObj.setHours(wakeHour);
    wakeDateObj.setMinutes(wakeMin);

    
    const wakeDateISO = wakeDateObj.toISOString().split('T')[0]; 

    const res = await fetch('http://localhost:8080/home/sleeplogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date: wakeDateISO, sleep_time: sleepTime, wake_time: wakeTime, mood })
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
        <AverageSleep logs={logs} />
      </div>
    </div>
  );
}

export default Home;