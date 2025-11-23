import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/chat';

function ChatPage({ currentUser, authLoading }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (authLoading || !currentUser) {
      return;
    }

    let isMounted = true;
    let intervalId = null;

    const loadMessages = async () => {
      try {
        const data = await getMessages();
        if (isMounted) {
          setMessages(data);
          setError('');
        }
      } catch (loadError) {
        console.error('Не удалось загрузить сообщения', loadError);
        if (isMounted) {
          setError('Не удалось загрузить сообщения.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadMessages();

    intervalId = window.setInterval(() => {
      loadMessages();
    }, 4000);

    return () => {
      isMounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [authLoading, currentUser]);

  if (authLoading) {
    return (
      <div
        data-easytag="id1-src/components/Chat/ChatPage.jsx"
        className="page-container"
      >
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newMessageText) {
      setError('Введите текст сообщения.');
      return;
    }

    setSending(true);
    setError('');

    try {
      const created = await sendMessage({ text: newMessageText });
      setMessages((prev) => [...prev, created]);
      setNewMessageText('');
    } catch (submitError) {
      console.error('Не удалось отправить сообщение', submitError);
      setError('Не удалось отправить сообщение.');
    } finally {
      setSending(false);
    }
  };

  const renderMessageTime = (createdAt) => {
    if (!createdAt) {
      return '';
    }

    try {
      const date = new Date(createdAt);
      return date.toLocaleString('ru-RU');
    } catch (timeError) {
      console.error('Ошибка формата даты сообщения', timeError);
      return createdAt;
    }
  };

  return (
    <div
      data-easytag="id1-src/components/Chat/ChatPage.jsx"
      className="page-container"
    >
      <h1 className="page-title">Групповой чат</h1>
      <p className="page-subtitle">
        Общайтесь с другими пользователями в общем чате.
      </p>

      <div className="chat-wrapper">
        <div className="chat-messages">
          {loading && messages.length === 0 && (
            <div className="chat-placeholder">Загрузка сообщений...</div>
          )}

          {!loading && messages.length === 0 && !error && (
            <div className="chat-placeholder">Сообщений пока нет.</div>
          )}

          {error && <div className="chat-error">{error}</div>}

          {messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="chat-message-header">
                <span className="chat-message-username">{message.username}</span>
                <span className="chat-message-time">
                  {renderMessageTime(message.created_at)}
                </span>
              </div>
              <div className="chat-message-text">{message.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            className="chat-input"
            placeholder="Введите сообщение..."
            value={newMessageText}
            onChange={(event) => setNewMessageText(event.target.value)}
            disabled={sending}
            rows={3}
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={sending}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
