// LoginModal.js
import React from "react";
import "./LoginModal.css";
import "../App.css";

const LoginModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Login</h2>
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <form>
          <input type="text" placeholder="Username" className="modal-input" />
          <input
            type="password"
            placeholder="Password"
            className="modal-input"
          />
          <button type="submit" className="modal-submit">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
