// AdminPage.js
import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminPage = () => {
  const [targetName, setTargetName] = useState("");
  const [currentTargetName, setCurrentTargetName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/target-name")
      .then((res) => res.json())
      .then((data) => setCurrentTargetName(data.name))
      .catch(() => setMessage("Failed to load current target name"));
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/target-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: targetName }),
      });
      if (response.ok) {
        setMessage("Target name updated successfully!");
        setCurrentTargetName(targetName);
        setTargetName("");
      } else {
        setMessage("Failed to update target name");
      }
    } catch (error) {
      setMessage("Error updating target name");
    }
  };

  return (
    <div className="admin-container">
      <h1>관리자 페이지</h1>
      <div className="current-name">
        <h2>현재 대상자 이름</h2>
        <p>{currentTargetName || "현재 대상 없음"}</p>
      </div>
      <div className="input-group">
        <label htmlFor="targetName" className="input-label">
          화면에 띄울 이름을 설정하세요
        </label>
        <input
          type="text"
          id="targetName"
          value={targetName}
          onChange={(e) => setTargetName(e.target.value)}
          className="input-field"
          placeholder="Enter target name"
        />
        <button onClick={handleSave} className="save-button">
          저장
        </button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AdminPage;
