import React, { useState } from 'react';

function getSleepDuration(sleepTime, wakeTime) {
  const [sh, sm] = sleepTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let start = sh * 60 + sm;
  let end = wh * 60 + wm;
  if (end <= start) end += 24 * 60;
  return (end - start) / 60;
}

function AverageSleep({ logs }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [average, setAverage] = useState(null);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    const filtered = logs.filter(log => log.date.startsWith(month));
    if (filtered.length === 0) {
      setAverage(null);
      return;
    }
    const total = filtered.reduce(
      (sum, log) => sum + getSleepDuration(log.sleep_time, log.wake_time),
      0
    );
    setAverage((total / filtered.length).toFixed(2));
  };

  return (
    <div>
      <h3>Average Sleep Per Month</h3>
      <label>
        Select Month:&nbsp;
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        />
      </label>
      {selectedMonth && (
        average !== null ? (
          <div className="average-sleep-card">
            <span>Average sleep for {selectedMonth}:</span>
            <br />
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              {average} hours
              <span className="zzz">💤</span>
            </span>
          </div>
        ) : (
          <div className="average-sleep-card" style={{ color: '#888' }}>
            No sleep logs for this month.
          </div>
        )
      )}
    </div>
  );
}

export default AverageSleep;