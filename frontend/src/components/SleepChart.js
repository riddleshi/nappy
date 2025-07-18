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

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
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