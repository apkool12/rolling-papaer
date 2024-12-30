import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./MessagesModal.css";

const MessageCard = ({ children, onDelete, messageId }) => (
  <motion.div
    className="message-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
    <button
      className="message-delete"
      onClick={() => onDelete(messageId)}
      aria-label="메시지 삭제"
    >
      ×
    </button>
  </motion.div>
);

const MessageList = ({ messages, type, onDelete }) => {
  if (!messages.length) {
    return (
      <motion.div
        className="messages-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {type === "sent"
          ? "보낸 메시지가 없습니다."
          : "새로운 알림이 없습니다."}
      </motion.div>
    );
  }

  const renderContent = (message) => {
    if (type === "sent") {
      return (
        <>
          <p className="message-recipient">To: {message.recipient}</p>
          <p className="message-content">{message.content}</p>
        </>
      );
    } else {
      return (
        <>
          <p className="notification-text">
            <strong>{message.author}</strong>님이 편지를 보내셨습니다!
          </p>
          <p className="message-content">{message.content}</p>
        </>
      );
    }
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageCard
          key={message.id}
          messageId={message.id}
          onDelete={onDelete}
        >
          <div className="message-header">
            <div>{renderContent(message)}</div>
            <p className="message-date">
              {new Date(message.created_at).toLocaleDateString()}
            </p>
          </div>
        </MessageCard>
      ))}
    </div>
  );
};

const MessagesModal = ({ isOpen, onClose, type, userNickname }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!userNickname) return;

    try {
      setLoading(true);
      const endpoint =
        type === "sent"
          ? `https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/sent_messages/?author=${userNickname}`
          : `https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/notifications/?recipient=${userNickname}`;
      const response = await axios.get(endpoint);
      setMessages(response.data);
    } catch (err) {
      setError("메시지를 불러오는데 실패했습니다.");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, [type, userNickname]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(
        `https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/${messageId}/`
      );
      await fetchMessages();
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("메시지 삭제에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="messages-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="messages-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="messages-aurora" />

          <button onClick={onClose} className="messages-close">
            ×
          </button>

          <h2 className="messages-title">
            {type === "sent" ? "내가 보낸 메시지" : "알림"}
          </h2>

          {loading ? (
            <div className="messages-loading">로딩중...</div>
          ) : error ? (
            <div className="messages-error">{error}</div>
          ) : (
            <MessageList
              messages={messages}
              type={type}
              onDelete={handleDelete}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MessagesModal;
