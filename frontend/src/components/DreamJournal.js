import React, { useState, useEffect } from 'react';
import '../App.css';

function DreamJournal() {
  const [dream, setDream] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [dreams, setDreams] = useState([]);
  const [aiLoading, setAiLoading] = useState(null);
  const [showDreams, setShowDreams] = useState(false);

  const fetchDreams = async () => {
    const res = await fetch('http://localhost:8080/dream-journal', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setDreams(data.dreams || []);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/dream-journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ date, dream_text: dream })
    });
    if (res.ok) {
      setMessage('Dream saved!');
      setDream('');
      setDate('');
      fetchDreams();
    } else {
      setMessage('Failed to save dream.');
    }
  };

  const handleInterpret = async (dreamObj) => {
    setAiLoading(dreamObj.id);
    const res = await fetch('http://localhost:8080/dream-journal/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dream_text: dreamObj.dream_text, id: dreamObj.id })
    });
    if (res.ok) {
      const data = await res.json();
      setDreams(dreams =>
        dreams.map(d =>
          d.id === dreamObj.id ? { ...d, ai_response: data.ai_response } : d
        )
      );
    }
    setAiLoading(null);
  };

  return (
    <div className="page-background dream-journal-bg" style={{ minHeight: '100vh' }}>
      <div className="form-container dream-journal-form-container">
        <h2>Dream Journal</h2>
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <textarea
            value={dream}
            onChange={e => setDream(e.target.value)}
            rows={5}
            className="dream-journal-textarea"
            required
          />
          <button type="submit" className="dream-journal-save-btn">Save Dream</button>
        </form>
        {message && <div style={{ marginTop: '1rem' }}>{message}</div>}
        <button
          onClick={() => setShowDreams(v => !v)}
          className="dream-journal-toggle-btn"
        >
          What have I been dreaming of?
        </button>
        {showDreams && (
          <ul className="dream-journal-list">
            {dreams.map(d => (
              <li key={d.id} className="dream-journal-list-item">
                <span className="dream-journal-date">
                  {new Date(d.date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}:
                </span>
                <div style={{ whiteSpace: 'pre-line' }}>{d.dream_text}</div>
                <button
                  className="dream-journal-interpret-btn"
                  onClick={() => handleInterpret(d)}
                  disabled={aiLoading === d.id}
                >
                  {aiLoading === d.id ? "Interpreting..." : "Let AI Interpret this dream"}
                </button>
                <div className="dream-journal-ai-box">
                  <strong>AI Interpretation:</strong>
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {d.ai_response ? d.ai_response : "None"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DreamJournal;