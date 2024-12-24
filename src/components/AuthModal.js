import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AuthModal.css';

const AuthModal = ({ isLogin, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
    });
    const [errors, setErrors] = useState({});

    const validNicknames = ['우은식', '이정민', '한승원', '원동우', '김정현', '박주원'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        } else if (formData.password.length < 3) {
            newErrors.password = '비밀번호는 최소 3자 이상이어야 합니다';
        }
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
        }

        if (!isLogin && !validNicknames.includes(formData.nickname)) {
            newErrors.nickname = '유효한 이름을 입력해주세요';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length === 0) {
            onSubmit(formData);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isLogin ? '로그인' : '회원가입'}
                    </h2>
                    <p className="modal-subtitle">
                        {isLogin 
                            ? '롤링페이퍼를 통해서,'
                            : '추억을 회상해볼까요'}
                    </p>
                </div>
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">이름 입력</label>
                        <input
                            type="text"
                            name="nickname"
                            className="form-input"
                            placeholder="이름을 입력해주세요"
                            value={formData.nickname}
                            onChange={handleChange}
                        />
                        {errors.nickname && (
                            <p className="form-error">{errors.nickname}</p>
                        )}
                    </div>


                    <div className="form-group">
                        <label className="form-label">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="비밀번호를 입력해주세요"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="form-error">{errors.password}</p>}
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="비밀번호를 다시 입력해주세요"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <p className="form-error">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}
                    

                    <button type="submit" className="auth-button primary-button">
                        {isLogin ? '로그인' : '회원가입'}
                    </button>
                    
                    <button 
                        type="button" 
                        className="auth-button secondary-button"
                        onClick={() => onSubmit({ type: isLogin ? 'signup' : 'login' })}
                    >
                        {isLogin ? '회원가입하기' : '로그인하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

AuthModal.propTypes = {
    isLogin: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default AuthModal;