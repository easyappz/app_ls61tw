import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';

function ProfilePage({ currentUser, authLoading, onLogout }) {
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div
        data-easytag="id1-src/components/Profile/ProfilePage.jsx"
        className="page-container"
      >
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (logoutError) {
      console.error('Ошибка при выходе из аккаунта', logoutError);
    }

    if (onLogout) {
      onLogout();
    }

    navigate('/login');
  };

  const registrationDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleString('ru-RU')
    : 'Неизвестно';

  return (
    <div
      data-easytag="id1-src/components/Profile/ProfilePage.jsx"
      className="page-container"
    >
      <h1 className="page-title">Профиль пользователя</h1>
      <p className="page-subtitle">
        Основная информация о вашем аккаунте.
      </p>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Имя пользователя:</span>
          <span className="profile-value">{currentUser.username}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Дата регистрации:</span>
          <span className="profile-value">{registrationDate}</span>
        </div>

        <button
          type="button"
          className="form-button profile-logout-button"
          onClick={handleLogoutClick}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
