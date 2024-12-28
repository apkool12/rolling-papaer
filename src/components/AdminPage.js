import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import CustomAlert from "./CustomAlert";
import "./AdminPage.css";

const AdminPage = () => {
  const [announcement, setAnnouncement] = useState("");
  const [recipients, setRecipients] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const recipientList = recipients.split(",").map((r) => r.trim());

      await Promise.all(
        recipientList.map((recipient) =>
          axios.post(
            "http://https://port-0-rolling-papaer-lyo9x8ghce54051e.sel5.cloudtype.app/api/letters/",
            {
              author: "관리자",
              content: announcement,
              recipient: recipient,
              is_anonymous: false,
              is_read: false,
            }
          )
        )
      );

      setAlertConfig({
        isOpen: true,
        message: "공지가 성공적으로 전송되었습니다.",
        type: "success",
      });
      setAnnouncement("");
      setRecipients("");
    } catch (error) {
      setAlertConfig({
        isOpen: true,
        message: "공지 전송에 실패했습니다.",
        type: "info",
      });
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-aurora" />

      <div className="admin-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-form-container"
        >
          <h1 className="admin-title">공지사항 관리</h1>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label className="admin-label">수신자 (쉼표로 구분)</label>
              <input
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="user1, user2, user3"
                className="admin-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">공지내용</label>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="admin-textarea"
                placeholder="공지내용을 입력하세요..."
                required
              />
            </div>

            <button type="submit" className="admin-submit-button">
              공지 보내기
            </button>
          </form>
        </motion.div>
      </div>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
};

export default AdminPage;
