import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import MessagesModal from "./MessagesModal";
import "./Header.css";

const Header = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isLogin: true,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedNickname = localStorage.getItem("userNickname");

    if (storedLoginStatus === "true" && storedNickname) {
      setIsLoggedIn(true);
      setUser({ nickname: storedNickname });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".dropdown-container");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser({ nickname: userData.nickname });
    setIsLoggingIn(false);
    setError(null);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userNickname", userData.nickname);
  };

  const handleMenuClick = (type) => {
    setIsDropdownOpen(false);
    setModalType(type);
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const navigate = useNavigate();

  const handleHome = () => {
    navigate(`/`);
  };

  const handleAuthSubmit = async (data) => {
    if (data.type === "login") {
      setModalConfig({ isOpen: true, isLogin: true });
      return;
    }
    if (data.type === "signup") {
      setModalConfig({ isOpen: true, isLogin: false });
      return;
    }

    try {
      setIsLoggingIn(true);
      setError(null);

      const response = await fetch(
        "https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/accounts/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "로그인 실패");
      }

      handleLoginSuccess({ nickname: result.nickname });
      handleModalClose();
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoggedIn(false);
      setUser(null);

      // 로그아웃 시 로컬스토리지 데이터 삭제
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userNickname");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          롤링페이퍼
        </Link>

        <nav className="nav-menu">
          {isLoggedIn ? (
            <div className="auth-status">
              <div className="user-profile">
                <span className="user-name">{user?.nickname}</span>
                <div className="dropdown-container">
                  <button
                    className="dropdown-toggle"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="메뉴"
                  >
                    메뉴
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => handleMenuClick("sent")}
                        >
                          <span className="icon">💌</span>
                          내가 보낸 메시지
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => handleMenuClick("notifications")}
                        >
                          <span className="icon">🔔</span>
                          알림
                        </button>
                        <div className="dropdown-divider" />
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                            handleHome();
                          }}
                        >
                          <span className="icon">🚪</span>
                          로그아웃
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                className="auth-button outline"
                onClick={() => setModalConfig({ isOpen: true, isLogin: true })}
                disabled={isLoggingIn}
              >
                로그인
              </button>
              <button
                className="auth-button solid"
                onClick={() => setModalConfig({ isOpen: true, isLogin: false })}
                disabled={isLoggingIn}
              >
                회원가입
              </button>
            </div>
          )}
        </nav>
      </div>
      <AnimatePresence>
        {modalType && (
          <MessagesModal
            isOpen={!!modalType}
            onClose={handleCloseModal}
            type={modalType}
            userNickname={user?.nickname}
          />
        )}
      </AnimatePresence>
      {modalConfig.isOpen && (
        <AuthModal
          isLogin={modalConfig.isLogin}
          onClose={handleModalClose}
          onSubmit={handleAuthSubmit}
          onLoginSuccess={handleLoginSuccess}
          isLoading={isLoggingIn}
          error={error}
        />
      )}
    </header>
  );
};

export default Header;
