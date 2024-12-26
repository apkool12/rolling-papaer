import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/Header";
import AdminPage from "./components/AdminPage";
import Home from "./components/Home";
import RollingPaper from "./components/RollingPaper";
import SentMessages from "./components/SentMessages";

const App = () => {
  const [userNickname, setUserNickname] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedNickname = localStorage.getItem("userNickname");
    
    if (storedLoginStatus === "true" && storedNickname) {
      setIsLoggedIn(true);
      setUserNickname(storedNickname);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserNickname(userData.nickname);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserNickname(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userNickname");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header 
          isLoggedIn={isLoggedIn} 
          userNickname={userNickname}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
              />
            }
          />
          <Route 
            path="/sent-messages"
            element={
              <SentMessages 
              />
            }     
          />
          <Route 
            path="/RollingPaper/" 
            element={
              <RollingPaper 
                isLoggedIn={isLoggedIn}
                userNickname={userNickname}
              />
            }
          />
          <Route path="/Admin/*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;