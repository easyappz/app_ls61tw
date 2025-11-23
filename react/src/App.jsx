import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import ChatPage from './components/Chat/ChatPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  return (
    <ErrorBoundary>
      <div data-easytag="id1-src/App.jsx" className="app-root">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-title">Групповой чат</div>
            <nav className="app-nav">
              <Link to="/" className="app-nav-link">
                Чат
              </Link>
              <Link to="/profile" className="app-nav-link">
                Профиль
              </Link>
              <Link to="/login" className="app-nav-link">
                Вход
              </Link>
              <Link to="/register" className="app-nav-link app-nav-link-primary">
                Регистрация
              </Link>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
