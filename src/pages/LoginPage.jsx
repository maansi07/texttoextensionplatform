jsx
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to Extensio.ai</p>
        <input className="auth-input" type="email" placeholder="Email" />
        <input className="auth-input" type="password" placeholder="Password" />
        <button className="auth-btn">Sign In</button>
        <p className="auth-link">
          Don't have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
}