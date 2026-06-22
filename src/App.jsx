import { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("home");
  const [prompt, setPrompt] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          {activeTab === "home" && (
            <>
              <Hero setActiveTab={setActiveTab} />
              <Features />
              <HowItWorks />
              <CodePreview />
              <TrustedBy />
              <CTA setActiveTab={setActiveTab} />
            </>
          )}
          {activeTab === "generator" && (
            <Generator prompt={prompt} setPrompt={setPrompt} />
          )}
          {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} setPrompt={setPrompt} />}
          {activeTab === "templates" && (
            <TemplatesPage setActiveTab={setActiveTab} setPrompt={setPrompt} />
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}