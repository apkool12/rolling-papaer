import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
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

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedNickname = localStorage.getItem("userNickname");
    
    if (storedLoginStatus === "true" && storedNickname) {
      setIsLoggedIn(true);
      setUser({ nickname: storedNickname });
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser({ nickname: userData.nickname });
    setIsLoggingIn(false);
    setError(null);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userNickname", userData.nickname);
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
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
        "http://localhost:8000/api/accounts/login/",
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
                <button
                  className="auth-button outline logout"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
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