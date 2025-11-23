import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';

function LoginPage({ onLogin, currentUser, authLoading }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div
        data-easytag="id1-src/components/Auth/LoginPage.jsx"
        className="page-container"
      >
        <p>Загрузка...</p>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError('Введите имя пользователя и пароль.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await login({ username, password });
      const member = data.member;
      const token = data.token;

      if (onLogin && member && token) {
        onLogin(member, token);
      }

      navigate('/');
    } catch (submitError) {
      console.error('Ошибка авторизации', submitError);
      let message = 'Неверное имя пользователя или пароль.';

      if (submitError.response && submitError.response.data) {
        const data = submitError.response.data;
        if (typeof data.detail === 'string') {
          message = data.detail;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-easytag="id1-src/components/Auth/LoginPage.jsx"
      className="page-container"
    >
      <h1 className="page-title">Авторизация</h1>
      <p className="page-subtitle">Войдите в свой аккаунт, чтобы участвовать в чате.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-field">
            <label htmlFor="login-username" className="form-label">
              Имя пользователя
            </label>
            <input
              id="login-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password" className="form-label">
              Пароль
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="form-footer-text">
          Нет аккаунта?{' '}
          <Link to="/register" className="form-link">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
