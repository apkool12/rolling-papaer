import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/Header";
import AdminPage from "./components/AdminPage";
import Home from "./components/Home"
import RollingPaper from "./components/RollingPaper";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/RollingPaper/" element={<RollingPaper />}></Route>
					<Route path="/Admin/*" element={<AdminPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
