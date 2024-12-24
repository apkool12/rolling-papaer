import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import './Header.css';

const Header = () => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isLogin: true
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleAuthSubmit = async (data) => {
    if (data.type === 'login') {
      setModalConfig({ isOpen: true, isLogin: true });
      return;
    }
    if (data.type === 'signup') {
      setModalConfig({ isOpen: true, isLogin: false });
      return;
    }

    try {
      setIsLoggingIn(true);
      // 실제 API 호출을 시뮬레이션하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoggedIn(true);
      setUser({ nickname: data.nickname });
      handleModalClose();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
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
          isLoading={isLoggingIn}
        />
      )}
    </header>
  );
};

export default Header;