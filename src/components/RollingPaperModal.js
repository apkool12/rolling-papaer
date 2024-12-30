import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import CustomAlert from "./CustomAlert";
import "./RollingPaperModal.css";
import html2canvas from "html2canvas";

export const WriteModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    isAnonymous: true,
    content: "",
    recipient: "전체",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const recipients = [
    "우은식",
    "이채혁",
    "한승원",
    "원동우",
    "김정현",
    "박주원",
  ];
  
  const [userNickname, setUserNickname] = useState(
    localStorage.getItem("userNickname")
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );

  useEffect(() => {
    const storedNickname = localStorage.getItem("userNickname");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setUserNickname(storedNickname);
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  // 익명/본명 전환 시 수신인 자동 설정
  const handleAuthorTypeChange = (isAnonymous) => {
    setFormData({
      ...formData,
      isAnonymous: isAnonymous,
      recipient: isAnonymous ? "전체" : "", // 익명일 때는 '전체'로, 본명일 때는 빈 값으로
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.isAnonymous && !formData.recipient) {
      setAlert({
        isOpen: true,
        message: "수신인을 선택해주세요.",
        type: "info",
      });
      return;
    }

    if (!formData.content) {
      setAlert({
        isOpen: true,
        message: "내용을 입력해주세요.",
        type: "info",
      });
      return;
    }

    let author;
    if (formData.isAnonymous) {
      author = "익명";
    } else {
      if (!isLoggedIn || !userNickname) {
        setAlert({
          isOpen: true,
          message: "로그인이 필요합니다.",
          type: "info",
        });
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
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/",
        submitData,
        config
      );

      console.log("Form submitted:", response.data);
      setAlert({
        isOpen: true,
        message: "편지가 성공적으로 전송되었습니다!",
        type: "success",
      });

      setFormData({
        isAnonymous: true,
        content: "",
        recipient: "전체",
      });
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      let errorMessage = "편지 전송 중 오류가 발생했습니다.";

      if (error.response?.data) {
        const serverErrors = error.response.data;
        errorMessage = Object.entries(serverErrors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");
      }

      setAlert({
        isOpen: true,
        message: errorMessage,
        type: "info",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <CustomAlert
              isOpen={alert.isOpen}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ ...alert, isOpen: false })}
            />
            <button className="card-close" onClick={onClose}>
              ×
            </button>
            <h2 className="card-title">편지 쓰기</h2>
            <form className="write-form" onSubmit={handleSubmit}>
              <div className="Roll-form-group">
                <label className="Roll-form-label">작성 방식</label>
                <div className="author-type-container">
                  <button
                    type="button"
                    className={`author-type-button ${
                      formData.isAnonymous ? "active" : ""
                    }`}
                    onClick={() => handleAuthorTypeChange(true)}
                  >
                    익명
                  </button>
                  <button
                    type="button"
                    className={`author-type-button ${
                      !formData.isAnonymous ? "active" : ""
                    }`}
                    onClick={() => handleAuthorTypeChange(false)}
                  >
                    본명
                  </button>
                </div>
              </div>
              <div className="Roll-form-group">
                <label className="Roll-form-label">받는 사람</label>
                {formData.isAnonymous ? (
                  <select
                    className="Roll-form-input"
                    value="전체"
                    disabled
                  >
                    <option value="전체">전체</option>
                  </select>
                ) : (
                  <select
                    className="Roll-form-input"
                    value={formData.recipient}
                    onChange={(e) =>
                      setFormData({ ...formData, recipient: e.target.value })
                    }
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
                )}
              </div>
              <div className="Roll-form-group">
                <label className="Roll-form-label">내용</label>
                <textarea
                  className="Roll-form-input Roll-form-textarea"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="2024년 힘차게도 달린 우리들 수고많았다"
                />
              </div>
              <button type="submit" className="Roll-form-submit">
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
  const letterRef = useRef(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userNickname, setUserNickname] = useState(
    localStorage.getItem("userNickname")
  );
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    const storedNickname = localStorage.getItem("userNickname");
    setUserNickname(storedNickname);
  }, []);

  const fetchLetters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/"
      );
      const filteredLetters = response.data.filter(
        (letter) => letter.recipient === userNickname || letter.is_anonymous
      );
      setLetters(filteredLetters);
      setError(null);
    } catch (error) {
      console.error("Error fetching letters:", error);
      setError("편지를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userNickname]);

  useEffect(() => {
    if (isOpen) {
      fetchLetters();
    }
  }, [isOpen, fetchLetters]);

  const closeLetterDetail = () => setSelectedLetter(null);

  const handleSaveImage = async () => {
    if (!letterRef.current) return;

    try {
      setAlert({
        isOpen: true,
        message: "편지를 저장하는 중입니다...",
        type: "info",
      });

      const canvas = await html2canvas(letterRef.current, {
        backgroundColor: "white",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      canvas.toBlob(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${new Date().toISOString().slice(0, 10)}일 ${
            selectedLetter.author
          }님에게 온 편지.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          setAlert({
            isOpen: true,
            message: "편지가 성공적으로 저장되었습니다!",
            type: "success",
          });
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error saving letter:", error);
      setAlert({
        isOpen: true,
        message: "편지 저장에 실패했습니다.",
        type: "error",
      });
    }
  };

  const handleDeleteLetter = async (letterId) => {
    try {
      await axios.delete(
        `https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/${letterId}/`
      );
      setAlert({
        isOpen: true,
        message: "편지가 삭제되었습니다.",
        type: "success",
      });
      setLetters((prevLetters) =>
        prevLetters.filter((letter) => letter.id !== letterId)
      );
      setSelectedLetter(null);
    } catch (error) {
      console.error("Error deleting letter:", error);
      setAlert({
        isOpen: true,
        message: "편지 삭제에 실패했습니다.",
        type: "info",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="card-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <CustomAlert
              isOpen={alert.isOpen}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ ...alert, isOpen: false })}
            />
            <button className="card-close" onClick={onClose}>
              ×
            </button>
            <h2 className="card-title">편지 읽기</h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="loading-message">편지를 불러오는 중...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
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
                  <div className="letter-content-wrapper" ref={letterRef}>
                    <div className="letter-paper">
                      <div className="letter-paper-header">
                        From. {selectedLetter.author}
                      </div>
                      <div className="letter-paper-content">
                        {selectedLetter.content}
                      </div>
                    </div>
                  </div>
                  <div className="letter-footer">
                    <div className="letter-date">
                      {new Date(selectedLetter.created_at).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="letter-buttons">
                      <button
                        className="letter-action-btn save-btn"
                        onClick={handleSaveImage}
                      >
                        저장하기
                      </button>
                      <button
                        className="letter-action-btn delete-btn"
                        onClick={() => handleDeleteLetter(selectedLetter.id)}
                      >
                        삭제하기
                      </button>
                    </div>
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
