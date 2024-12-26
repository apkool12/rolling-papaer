import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import "./RollingPaperModal.css";

// WriteModal 컴포넌트 (편지 작성)
export const WriteModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    isAnonymous: true,
    content: "",
    recipient: "",
  });

  const recipients = ["우은식", "이정민", "한승원", "원동우", "김정현", "박주원"];
  const [userNickname, setUserNickname] = useState(localStorage.getItem("userNickname"));
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn"));

  useEffect(() => {
    const storedNickname = localStorage.getItem("userNickname");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setUserNickname(storedNickname);
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipient) {
      alert("수신인을 선택해주세요.");
      return;
    }

    if (!formData.content) {
      alert("내용을 입력해주세요.");
      return;
    }

    let author;
    if (formData.isAnonymous) {
      author = "익명"; // 익명으로 보낼 때는 "익명" 표시
    } else {
      if (!isLoggedIn || !userNickname) {
        alert("로그인이 필요합니다.");
        return;
      }
      author = userNickname;
    }

    const submitData = {
      author: author,
      content: formData.content.trim(),
      recipient: formData.recipient,
      is_anonymous: formData.isAnonymous,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await axios.post(
        "http://localhost:8000/api/letters/",
        submitData,
        config
      );

      console.log("Form submitted:", response.data);
      alert("편지가 성공적으로 전송되었습니다!");
      onClose();

      setFormData({
        isAnonymous: true,
        content: "",
        recipient: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      let errorMessage = "편지 전송 중 오류가 발생했습니다.";

      if (error.response?.data) {
        const serverErrors = error.response.data;
        errorMessage = Object.entries(serverErrors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n');
      }

      alert(errorMessage);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="card-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card-modal-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="card-modal-close" onClick={onClose}>
              ×
            </button>
            <h2 className="card-modal-title">편지 쓰기</h2>
            <form className="write-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">작성 방식</label>
                <div className="author-type-container">
                  <button
                    type="button"
                    className={`author-type-button ${formData.isAnonymous ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, isAnonymous: true })}
                  >
                    익명
                  </button>
                  <button
                    type="button"
                    className={`author-type-button ${!formData.isAnonymous ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, isAnonymous: false })}
                  >
                    이름
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">받는 사람</label>
                <select
                  className="form-input"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                >
                  <option value="" disabled>
                    편지를 보낼 대상을 선택하세요
                  </option>
                  {recipients.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">내용</label>
                <textarea
                  className="form-input form-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="2024년 힘차게도 달린 우리들 수고많았다"
                />
              </div>
              <button type="submit" className="form-submit">
                편지 보내기
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ReadModal = ({ isOpen, onClose }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userNickname, setUserNickname] = useState(localStorage.getItem("userNickname"));

  useEffect(() => {
    const storedNickname = localStorage.getItem("userNickname");
    setUserNickname(storedNickname);
  }, []);

  // useCallback을 사용하여 fetchLetters를 memoize
  const fetchLetters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/letters/");
      // 수신자별로 필터링: 본인이 수신자인 편지만 보여주기
      const filteredLetters = response.data.filter(letter => letter.recipient === userNickname || letter.is_anonymous);
      setLetters(filteredLetters);
      setError(null);
    } catch (error) {
      console.error("Error fetching letters:", error);
      setError("편지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userNickname]); // userNickname이 변경될 때마다 재실행

  useEffect(() => {
    if (isOpen) {
      fetchLetters(); // 수신자에 맞는 편지를 불러오기
    }
  }, [isOpen, fetchLetters]); // isOpen 또는 fetchLetters가 변경될 때마다 실행

  const closeLetterDetail = () => setSelectedLetter(null);

  // 편지 삭제 핸들러
  const handleDeleteLetter = async (letterId) => {
    try {
      await axios.delete(`http://localhost:8000/api/letters/${letterId}/`);
      alert("편지가 삭제되었습니다.");
      setLetters((prevLetters) => prevLetters.filter((letter) => letter.id !== letterId));
      setSelectedLetter(null); // 삭제 후 상세 보기 창 닫기
    } catch (error) {
      console.error("Error deleting letter:", error);
      alert("편지 삭제에 실패했습니다.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="card-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card-modal-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="card-modal-close" onClick={onClose}>
              ×
            </button>
            <h2 className="card-modal-title">편지 읽기</h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
                  편지를 불러오는 중...
                </div>
              ) : error ? (
                <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
                  {error}
                </div>
              ) : selectedLetter ? (
                <motion.div
                  className="letter-detail"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="letter-detail"
                >
                  <button className="back-button" onClick={closeLetterDetail}>
                    ← 목록으로
                  </button>
                  <div className="letter-paper">
                    <div className="letter-paper-header">
                      From. {selectedLetter.author}
                    </div>
                    <div className="letter-paper-content">
                      {selectedLetter.content}
                    </div>
                    <div className="letter-paper-footer" style={{ marginTop: '1rem', textAlign: 'right', color: '#666' }}>
                      {new Date(selectedLetter.created_at).toLocaleDateString()}
                    </div>
                    {/* 편지 삭제 버튼 추가 */}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteLetter(selectedLetter.id)}
                    >
                      삭제
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="letters-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key="letters-grid"
                >
                  {letters.map((letter) => (
                    <motion.div
                      key={letter.id}
                      className="letter-card"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedLetter(letter)}
                    >
                      <div className="letter-author">From. {letter.author}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
