import React from 'react';
import './Home.css';
import '../App.css'

const Home = () => {
  return (
    <div className="home-container">
      <main className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">
            한밭대학교 24학번 멍충이들의 1년
          </h1>
          
          <p className="main-subtitle">
            우리들이 겪은 일상, 소중한 일년을 추억하며.
          </p>
          
          

          <div className="button-container">
            <button className="start-button">
              Start
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;