import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

function getSleepDuration(sleepTime, wakeTime) {
  const [sh, sm] = sleepTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let start = sh * 60 + sm;
  let end = wh * 60 + wm;
  if (end <= start) end += 24 * 60;
  return ((end - start) / 60).toFixed(2);
}

function formatDate(dateInput) {
  // If it's a string like "YYYY-MM-DD", just return it
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  // Otherwise, try to parse as date and format as YYYY-MM-DD
  const date = new Date(dateInput);
  if (isNaN(date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function SleepChart({ logs }) {
  const chartData = logs.map(log => ({
    date: formatDate(log.date),
    hours: getSleepDuration(log.sleep_time, log.wake_time),
    mood: log.mood
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Sleep Duration Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#4a90e2" name="Sleep Hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SleepChart;