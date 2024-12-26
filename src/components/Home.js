import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { WriteModal } from "./RollingPaperModal";
import CustomAlert from "./CustomAlert";
import "./Home.css";
import "../App.css";

const Home = () => {
  const [particles, setParticles] = useState([]);
  const [snowflakes, setSnowflakes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRollingPaperClick = () => {
    if (!localStorage.getItem("isLoggedIn")) {
      setShowAlert(true);
      return;
    }
    navigate("/RollingPaper");
  };
  
  useEffect(() => {
    const createParticles = () => {
      const items = [];
      for (let i = 0; i < 40; i++) {
        items.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          scale: Math.random() * 0.5 + 0.5,
          animationDuration: `${Math.random() * 4 + 3}s`,
          delay: `${Math.random() * -10}s`,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(items);
    };

    const createSnowflakes = () => {
      const flakes = [];
      for (let i = 0; i < 30; i++) {
        flakes.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 8}s`,
          opacity: Math.random() * 0.5 + 0.2,
          size: `${Math.random() * 0.6 + 0.2}rem`,
          delay: `${Math.random() * -10}s`,
        });
      }
      setSnowflakes(flakes);
    };

    createParticles();
    createSnowflakes();
  }, []);

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
    >
      <div className="winter-overlay" />
      <div className="light-effect" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="light-particle"
            style={{
              left: particle.left,
              top: particle.top,
              transform: `scale(${particle.scale})`,
              animationDuration: particle.animationDuration,
              animationDelay: particle.delay,
              opacity: particle.opacity,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {snowflakes.map((flake) => (
          <div
            key={`snow-${flake.id}`}
            className="snowflake"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animationDuration: flake.animationDuration,
              animationDelay: flake.delay,
            }}
          />
        ))}
      </motion.div>
      <main className="main-content">
        <motion.div
          className="content-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="title-glow">
            <h1 className="main-title">멍충이들의 1년</h1>
          </div>
          <p className="main-subtitle">
            우리들이 지낸 일상, 우리들의 일년을 추억하며.
          </p>
          <div className="button-container">
            <motion.button
              className="start-button"
              onClick={handleRollingPaperClick}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 8px 12px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              style={{ marginRight: "1rem" }}
            >
              Start
            </motion.button>
          </div>
        </motion.div>
      </main>
      <CustomAlert
        isOpen={showAlert}
        message="로그인 후 접속 가능합니다."
        onClose={() => setShowAlert(false)}
        type="info"
      />
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        userNickname={localStorage.getItem("userNickname")}
      />
    </motion.div>
  );
};

export default Home;
