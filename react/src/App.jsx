import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

import ChatPage from './components/Chat/ChatPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ProfilePage from './components/Profile/ProfilePage';
import { getCurrentUser, saveToken, clearToken, getToken } from './api/auth';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const token = getToken();
        if (!token) {
          if (isMounted) {
            setAuthLoading(false);
          }
          return;
        }

        const user = await getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Не удалось загрузить текущего пользователя', error);
        clearToken();
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = (member, token) => {
    saveToken(token);
    setCurrentUser(member);
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
  };

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
            <Route
              path="/"
              element={
                <ChatPage
                  currentUser={currentUser}
                  authLoading={authLoading}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  onLogin={handleLogin}
                  currentUser={currentUser}
                  authLoading={authLoading}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  onLogin={handleLogin}
                  currentUser={currentUser}
                  authLoading={authLoading}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  currentUser={currentUser}
                  authLoading={authLoading}
                  onLogout={handleLogout}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
