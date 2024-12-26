import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CustomAlert.css";

const CustomAlert = ({ isOpen, message, onClose, type = "info" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="alert-wrapper">
          <motion.div
            className="alert-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="alert-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="alert-content">
              <div className={`alert-icon ${type}`}>
                {type === "success" ? "✓" : "i"}
              </div>
              <p className="alert-message">{message}</p>
              <motion.button
                className="alert-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                확인
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;
