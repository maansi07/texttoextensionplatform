import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Features from "./components/Features";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

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
        {activeTab === "generator" && <Generator />}
        {activeTab === "dashboard" && <Dashboard />}
      </main>
      <Footer />
    </div>
  );
}
