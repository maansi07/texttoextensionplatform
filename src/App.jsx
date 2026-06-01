import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Features from "./components/Features";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import TemplatesPage from "./pages/TemplatesPage";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === "home" && (
          <>
            <Hero setActiveTab={setActiveTab} />
            <Features />
          </>
        )}
        {activeTab === "generator" && (
          <Generator prompt={prompt} setPrompt={setPrompt} />
        )}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "templates" && (
          <TemplatesPage setActiveTab={setActiveTab} setPrompt={setPrompt} />
        )}
      </main>
      <Footer />
    </div>
  );
}