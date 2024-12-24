import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RollingPaperModal.css';

export const WriteModal = ({ isOpen, onClose, userNickname }) => {
    const [formData, setFormData] = useState({
        isAnonymous: true,
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            author: formData.isAnonymous ? '익명' : userNickname,
            content: formData.content,
            isAnonymous: formData.isAnonymous
        };
        console.log('Form submitted:', submitData);
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
                        <button className="card-modal-close" onClick={onClose}>×</button>
                        <h2 className="card-modal-title">편지 쓰기</h2>
                        <form className="write-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">작성 방식</label>
                                <div className="author-type-container">
                                    <button
                                        type="button"
                                        className={`author-type-button ${formData.isAnonymous ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, isAnonymous: true})}
                                    >
                                        익명
                                    </button>
                                    <button
                                        type="button"
                                        className={`author-type-button ${!formData.isAnonymous ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, isAnonymous: false})}
                                    >
                                        실명 ({userNickname})
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">내용</label>
                                <textarea
                                    className="form-input form-textarea"
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="2024년 힘차게도 달린 우리들 수고많았다"
                                />
                            </div>
                            <button type="submit" className="form-submit">편지 보내기</button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const ReadModal = ({ isOpen, onClose }) => {
    const [selectedLetter, setSelectedLetter] = useState(null);
    
    // 임시 데이터
    const letters = [
        { id: 1, author: "익명", content: "새로운 출발을 축하드립니다. 앞으로도 좋은 일만 가득하시길 바랍니다. 항상 건강하시고 행복하세요!" },
        { id: 2, author: "김철수", content: "함께한 시간이 정말 즐거웠습니다. 앞으로도 더 멋진 일들이 기다리고 있을 거예요. 응원합니다!" },
        { id: 3, author: "김철수", content: "함께한 시간이 정말 즐거웠습니다. 앞으로도 더 멋진 일들이 기다리고 있을 거예요. 응원합니다!" },
        { id: 4, author: "김철수", content: "함께한 시간이 정말 즐거웠습니다. 앞으로도 더 멋진 일들이 기다리고 있을 거예요. 응원합니다!" },
        { id: 5, author: "김철수", content: "함께한 시간이 정말 즐거웠습니다. 앞으로도 더 멋진 일들이 기다리고 있을 거예요. 응원합니다!" },
        { id: 6, author: "김철수", content: "함께한 시간이 정말 즐거웠습니다. 앞으로도 더 멋진 일들이 기다리고 있을 거예요. 응원합니다!" },
    ];

    const closeLetterDetail = () => setSelectedLetter(null);

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
                        <button className="card-modal-close" onClick={onClose}>×</button>
                        <h2 className="card-modal-title">편지 읽기</h2>
                        
                        <AnimatePresence mode="wait">
                            {selectedLetter ? (
                                <motion.div
                                    className="letter-detail"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    key="letter-detail"
                                >
                                    <button 
                                        className="back-button"
                                        onClick={closeLetterDetail}
                                    >
                                        ← 목록으로
                                    </button>
                                    <div className="letter-paper">
                                        <div className="letter-paper-header">
                                            From. {selectedLetter.author}
                                        </div>
                                        <div className="letter-paper-content">
                                            {selectedLetter.content}
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
                                            <div className="letter-author">
                                                From. {letter.author}
                                            </div>
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