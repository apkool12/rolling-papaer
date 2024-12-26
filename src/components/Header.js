import React, { useState } from "react";
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

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser({ nickname: userData.nickname });
    setIsLoggingIn(false);
    setError(null);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // 로그인/회원가입 요청 처리
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
      setError(null); // 로그인 오류 초기화

      // 실제 API 요청을 보내는 부분
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

      // 로그인 성공
      setIsLoggedIn(true);
      setUser({ nickname: result.nickname }); // 로그인한 사용자 정보 설정
      handleModalClose(); // 로그인 후 모달 닫기
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message); // 로그인 오류 메시지 표시
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoggedIn(false); // 로그아웃 후 로그인 상태 변경
      setUser(null); // 사용자 정보 초기화
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
                <span className="user-name">{user.nickname}</span>
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
