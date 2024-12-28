import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import RollingPaper from "./RollingPaper";

const AnimatedLayout = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/RollingPaper" element={<RollingPaper />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedLayout;
