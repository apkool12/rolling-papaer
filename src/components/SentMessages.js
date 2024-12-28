import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SentMessages.css";

const SentMessages = () => {
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userNickname = localStorage.getItem("userNickname");

  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/sent",
          {
            params: { author: userNickname },
          }
        );
        setSentMessages(response.data);
      } catch (err) {
        setError("메시지를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentMessages();
  }, [userNickname]);

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="sent-messages">
      <h2>내가 보낸 메시지</h2>
      {sentMessages.length > 0 ? (
        <ul>
          {sentMessages.map((message) => (
            <li key={message.id} className="sent-message-item">
              <p>
                <strong>To:</strong> {message.recipient}
              </p>
              <p>{message.content}</p>
              <p className="sent-date">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>보낸 메시지가 없습니다.</p>
      )}
    </div>
  );
};

export default SentMessages;
