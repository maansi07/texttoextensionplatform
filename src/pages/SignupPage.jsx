import "./LoginPage.css";

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join Extensio.ai for free</p>
        <input className="auth-input" type="text" placeholder="Full Name" />
        <input className="auth-input" type="email" placeholder="Email" />
        <input className="auth-input" type="password" placeholder="Password" />
        <button className="auth-btn">Create Account</button>
        <p className="auth-link">
          Already have an account? <span>Sign in</span>
        </p>
      </div>
    </div>
  );
}