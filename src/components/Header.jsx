import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          TextToExtension
        </Link>
        <nav className="nav-menu">
          <Link to="/pricing">Pricing</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <button
                className="avatar-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={user.avatar || 'https://via.placeholder.com/32'} alt={user.name} />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <p>{user.name}</p>
                    <small>{user.email}</small>
                  </div>
                  <hr />
                  <Link to="/profile">Profile</Link>
                  <Link to="/settings">Settings</Link>
                  <hr />
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;