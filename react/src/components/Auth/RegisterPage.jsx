import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

function RegisterPage({ onLogin, currentUser, authLoading }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div
        data-easytag="id1-src/components/Auth/RegisterPage.jsx"
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
      const data = await register({ username, password });
      const member = data.member;
      const token = data.token;

      if (onLogin && member && token) {
        onLogin(member, token);
      }

      navigate('/');
    } catch (submitError) {
      console.error('Ошибка регистрации', submitError);
      let message = 'Ошибка регистрации.';

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
      data-easytag="id1-src/components/Auth/RegisterPage.jsx"
      className="page-container"
    >
      <h1 className="page-title">Регистрация</h1>
      <p className="page-subtitle">Создайте новый аккаунт для участия в чате.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-field">
            <label htmlFor="register-username" className="form-label">
              Имя пользователя
            </label>
            <input
              id="register-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-password" className="form-label">
              Пароль
            </label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="form-footer-text">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="form-link">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
