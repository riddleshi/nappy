import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      navigate('/login');
    } else {
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="page-background register-bg">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          /><br/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          /><br/>
          <button type="submit">Register</button>
        </form>
        {message && <div>{message}</div>}
      </div>
    </div>
  );
}

export default Register;