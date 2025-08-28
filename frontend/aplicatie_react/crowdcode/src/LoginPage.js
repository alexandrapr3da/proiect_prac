import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './styles.css';

function LoginPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateToken = (token) => token && token.length > 10;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateToken(tokenInput)) {
      setError('Invalid GitHub token. Must be 40 hexadecimal characters.');
      return;
    }

    try {
      const res = await axios.post(
          'http://localhost:8001/token',
          { github_token: tokenInput },
          { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.status === 200) {
        const { access_token } = res.data;
        login(access_token);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
      <div className="container">
        <div className="bubble"></div>
        <div className="bubble-small"></div>
        <div className="bubble-bottom"></div>

        <div className="login-container">
          <div className="card">
            <h1 className="gradient-text">Welcome!</h1>
            <p>Login to CrowdCode with GitHub</p>
            <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="Enter your GitHub Personal Access Token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
              />
              <button type="submit">Log In</button>
            </form>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
  );
}

export default LoginPage;