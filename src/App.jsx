import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CodePreview from "./components/CodePreview";
import TrustedBy from "./components/TrustedBy";
import CTA from "./components/CTA";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import TemplatesPage from "./pages/TemplatesPage";
import "./App.css";
import Aurora from "./components/Aurora";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const setActiveTab = (tab) => {
    if (tab === "home") navigate("/");
    else navigate(`/${tab}`);
  };

  const activeTab = location.pathname === "/" ? "home" : location.pathname.substring(1);

  return (
    <>
      <Aurora
        colorStops={["#2041e7","#8d2ee6","#27fffd"]}
        blend={0.72}
        amplitude={1.0}
        speed={0.8}
        className="app-aurora-bg"
      />

      <div className="app app-content">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero setActiveTab={setActiveTab} />
                <Features />
                <CodePreview />
                <TrustedBy />
                <CTA setActiveTab={setActiveTab} />
              </>
            } />
            <Route path="/generator" element={<Generator prompt={prompt} setPrompt={setPrompt} />} />
            <Route path="/dashboard" element={<Dashboard setActiveTab={setActiveTab} setPrompt={setPrompt} />} />
            <Route path="/templates" element={<TemplatesPage setActiveTab={setActiveTab} setPrompt={setPrompt} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}