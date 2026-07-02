import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Lock, Zap, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import "./PricingPage.css";

export default function PricingPage() {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successPlan, setSuccessPlan] = useState(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Perfect for testing capabilities",
      price: "0",
      description: "Explore pre-built extension templates with complete source downloads.",
      btnText: "Choose Starter",
      btnClass: "pricing-btn-free",
      features: [
        { text: "Access 6 premium pre-built templates", allowed: true },
        { text: "Fully downloadable template ZIP files", allowed: true },
        { text: "Inspect code preview in the browser", allowed: true },
        { text: "Custom AI prompt generation", allowed: false },
        { text: "Agentic iterative editing (Edit-in-Place)", allowed: false },
        { text: "Security and permission audit dashboard", allowed: false },
      ]
    },
    {
      id: "builder",
      name: "Builder",
      tagline: "Best for prompt prototyping",
      price: "29",
      description: "Generate any extension using custom prompts and refine your ideas in real-time.",
      btnText: "Upgrade to Builder",
      btnClass: "pricing-btn-secondary",
      featured: true,
      features: [
        { text: "Custom AI prompt generation", allowed: true },
        { text: "Inspect full code preview in browser", allowed: true },
        { text: "Access 6 premium pre-built templates", allowed: true },
        { text: "Download ZIP files for custom prompts", allowed: false },
        { text: "Agentic iterative editing (Edit-in-Place)", allowed: false },
        { text: "Security and permission audit dashboard", allowed: false },
      ]
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "The full power of agentic build",
      price: "79",
      description: "Unlock unlimited ZIP downloads, conversational updates, and trust auditing.",
      btnText: "Upgrade to Pro",
      btnClass: "pricing-btn-primary",
      features: [
        { text: "Custom AI prompt generation", allowed: true },
        { text: "Inspect full code preview in browser", allowed: true },
        { text: "Unlimited ZIP downloads & packaging", allowed: true },
        { text: "Agentic iterative editing (Edit-in-Place)", allowed: true },
        { text: "Security and permission audit dashboard", allowed: true },
        { text: "High priority Gemini rate limits", allowed: true },
      ]
    }
  ];

  const handleSelectPlan = async (planId) => {
    if (!user) {
      navigate("/login?redirect=pricing");
      return;
    }

    if (user.plan === planId) return;

    setLoadingPlan(planId);
    setErrorMessage(null);
    try {
      await updatePlan(planId);
      setSuccessPlan(planId);
      setTimeout(() => setSuccessPlan(null), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update plan. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1 className="pricing-title">Find the Right Plan for Your Needs</h1>
        <p className="pricing-subtitle">
          Scale your browser extension factory from simple template exports to
          dynamic, agentic AI edits and complete trust audits.
        </p>
      </div>

      {errorMessage && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          padding: "1rem",
          borderRadius: "0.75rem",
          color: "#f87171",
          marginBottom: "2rem",
          fontSize: "0.9rem"
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="pricing-grid">
        {plans.map((plan) => {
          const isCurrent = user && user.plan === plan.id;
          return (
            <div key={plan.id} className={`pricing-card ${plan.featured ? "featured" : ""}`}>
              {plan.featured && <span className="popular-badge">Popular</span>}
              
              <div className="card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.tagline}</p>
                <div className="plan-price-container">
                  <span className="plan-currency">$</span>
                  <span className="plan-price">{plan.price}</span>
                  <span className="plan-duration">/mo</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.5rem 0 1.5rem 0", lineHeight: "1.4" }}>
                  {plan.description}
                </p>
              </div>

              <button
                className={`pricing-btn ${isCurrent ? "pricing-btn-current" : plan.btnClass}`}
                disabled={loadingPlan !== null || isCurrent}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {loadingPlan === plan.id ? (
                  <span>Upgrading...</span>
                ) : isCurrent ? (
                  <span>Active Plan</span>
                ) : (
                  <>
                    <span>{plan.btnText}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`feature-item ${!feature.allowed ? "locked" : ""}`}>
                    <div className="feature-icon-wrapper">
                      {feature.allowed ? (
                        <Check size={16} className="feature-icon-check" />
                      ) : (
                        <Lock size={14} className="feature-icon-lock" />
                      )}
                    </div>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {successPlan && (
        <div className="upgrade-success-toast">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981"
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: "bold", fontSize: "0.95rem" }}>Plan Upgraded!</h4>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
              Successfully switched to the {successPlan.toUpperCase()} tier.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
