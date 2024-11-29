import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/Header";
import AdminPage from "./components/AdminPage";
import Home from "./components/Home"

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
					<Route path="/Admin/*" element={<AdminPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
