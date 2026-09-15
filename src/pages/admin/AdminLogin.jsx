import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      loginSuccess(data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-logo">DEV.OS</div>
        <div className="login-subtitle">Admin Access</div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">Username</label>
            <input
              type="text"
              className="field-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">⚠ {error}</div>}

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard →'}
          </button>
        </form>

        <a href="/" className="login-back">← Back to Portfolio</a>
      </div>
    </div>
  );
};

export default AdminLogin;
