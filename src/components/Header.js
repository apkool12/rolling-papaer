import React, { useState } from "react";
import { Link } from 'react-router-dom';

import "./Header.css";
import "../App.css";
import LoginModal from "./LoginModal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link to="/" className="link">롤링페이퍼</Link>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded border-none Login-font"
            onClick={() => setIsModalOpen(true)}
          >
            Login
          </button>
        </div>
      </header>
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Header;
