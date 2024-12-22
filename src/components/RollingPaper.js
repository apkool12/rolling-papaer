    import React, { useEffect, useState, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import './RollingPaper.css';

    const RollingPaper = () => {
        const [snowflakes, setSnowflakes] = useState([]);
        const [stars, setStars] = useState([]);

        // 별 생성 함수
        const createStars = useCallback(() => {
            const newStars = [];
            for (let i = 0; i < 50; i++) {
                newStars.push({
                    id: i,
                    style: {
                        '--star-x': Math.random(),
                        '--star-y': Math.random(),
                        '--star-opacity': Math.random() * 0.5 + 0.1
                    }
                });
            }
            setStars(newStars);
        }, []);

        // 눈송이 생성 함수
        const createSnowflakes = useCallback(() => {
            const flakes = [];
            for (let i = 0; i < 40; i++) {
                flakes.push({
                    id: i,
                    top: `${Math.random() * -10}%`, // 화면 상단에서 시작
                    left: `${Math.random() * 100}%`,
                    size: `${Math.random() * 1 + 0.5}rem`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animationDuration: `${Math.random() * 3 + 8}s`,
                    animationDelay: `${Math.random() * -20}s`
                });
            }
            setSnowflakes(flakes);
        }, []);

        useEffect(() => {
            createStars();
            createSnowflakes();
        }, [createStars, createSnowflakes]);

        return (
            <motion.div 
                className="rolling-paper-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
            
                <div className="rolling-paper-aurora" />
                {stars.map((star) => (
                    <div
                        key={`star-${star.id}`}
                        className="rolling-paper-starlight"
                        style={star.style}
                    />
                ))}
                {snowflakes.map((flake) => (
                    <div
                        key={`snow-${flake.id}`}
                        className="rolling-paper-snowflake"
                        style={{
                            top: flake.top,
                            left: flake.left,
                            fontSize: flake.size,
                            animationDuration: flake.animationDuration,
                            animationDelay: flake.animationDelay,
                            opacity: flake.opacity,
                        }}
                    >
                        ❄
                    </div>
                ))}
                <motion.div 
                    className="rolling-paper-content-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.div 
                        className="rolling-paper-title-glow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <h1 className="rolling-paper-main-title">
                            Computer Engineering
                        </h1>
                    </motion.div>
                    <motion.p 
                        className="rolling-paper-main-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                    >
                        우리들의 추억을 나누는 시간.
                    </motion.p>
                    <motion.div 
                        className="rolling-paper-button-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <motion.button 
                            className="rolling-paper-read-letter-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            편지 읽기
                        </motion.button>
                        <motion.button 
                            className="rolling-paper-write-letter-button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            편지 쓰기
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    };

    export default RollingPaper;