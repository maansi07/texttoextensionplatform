import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Text to Chrome Extensions</h1>
          <p>Create powerful Chrome extensions from simple text descriptions using AI</p>
          <div className="hero-buttons">
            {user ? (
              <>
                <Link to="/generator" className="btn btn-primary">
                  Start Building
                </Link>
                <Link to="/dashboard" className="btn btn-secondary">
                  My Extensions
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link to="/pricing" className="btn btn-secondary">
                  View Plans
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Generate extensions in seconds, not hours</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Powered</h3>
            <p>Advanced AI understands your requirements</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>One-Click Download</h3>
            <p>Download as ready-to-use ZIP files</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Code Preview</h3>
            <p>Review and edit generated code</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Save & Manage</h3>
            <p>Keep all your extensions organized</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Version Control</h3>
            <p>Track changes and iterations</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Build Your First Extension?</h2>
        <Link to={user ? '/generator' : '/signup'} className="btn btn-large">
          {user ? 'Start Now' : 'Sign Up Free'}
        </Link>
      </section>
    </div>
  );
};

export default HomePage;