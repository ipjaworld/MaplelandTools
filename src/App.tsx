import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Calculator from "./pages/Calculator";
import History from "./pages/History";
import About from "./pages/About";
import MainPage from "./pages/MainPage";
import HuntingGrounds from "./pages/HuntingGrounds";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { CalculatorProvider } from "./contexts/CalculatorContext";
import "./styles/globals.css";

// Navigation wrapper for MainPage
const MainPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <MainPage onNavigate={navigate} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<MainPageWrapper />} />
              <Route path="/main" element={<MainPageWrapper />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/hunting-grounds" element={<HuntingGrounds />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </CalculatorProvider>
    </ThemeProvider>
  );
};

export default App;
