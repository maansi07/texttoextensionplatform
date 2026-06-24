import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../context/AuthContext';
import '../styles/UpgradePage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const UpgradePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async (plan) => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.success) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upgrade-page">
      <div className="upgrade-container">
        <h1>Upgrade Your Plan</h1>
        <p>Current Plan: <strong>{user?.plan}</strong></p>

        <div className="upgrade-cards">
          {user?.plan !== 'Builder' && (
            <div className="upgrade-card">
              <h3>Builder</h3>
              <p className="price">$9.99<span>/month</span></p>
              <ul>
                <li>Custom AI generation</li>
                <li>Code preview</li>
                <li>Priority support</li>
              </ul>
              <button
                onClick={() => handleUpgrade('Builder')}
                disabled={loading}
                className="btn-upgrade"
              >
                {loading ? 'Processing...' : 'Upgrade to Builder'}
              </button>
            </div>
          )}

          {user?.plan !== 'Pro' && (
            <div className="upgrade-card popular">
              <div className="badge">Most Popular</div>
              <h3>Pro</h3>
              <p className="price">$29.99<span>/month</span></p>
              <ul>
                <li>Everything in Builder</li>
                <li>Zip download</li>
                <li>Save to account</li>
                <li>Unlimited extensions</li>
                <li>24/7 support</li>
              </ul>
              <button
                onClick={() => handleUpgrade('Pro')}
                disabled={loading}
                className="btn-upgrade btn-primary"
              >
                {loading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;