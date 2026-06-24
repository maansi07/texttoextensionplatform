import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/PricingPage.css';

const PricingPage = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Templates only',
        'No AI generation',
        'No download',
        'Basic support',
      ],
    },
    {
      name: 'Builder',
      price: '$9.99',
      interval: '/month',
      description: 'For active builders',
      features: [
        'Custom AI generation',
        'Code preview',
        'No zip download',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Pro',
      price: '$29.99',
      interval: '/month',
      description: 'Everything you need',
      features: [
        'Everything in Builder',
        'Zip download',
        'Save to account',
        'Unlimited extensions',
        '24/7 support',
      ],
    },
  ];

  return (
    <div className="pricing-container">
      <h1>Simple, Transparent Pricing</h1>
      <p className="pricing-subtitle">Choose the plan that's right for you</p>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h2>{plan.name}</h2>
            <div className="price">
              {plan.price}
              {plan.interval && <span className="interval">{plan.interval}</span>}
            </div>
            <p className="description">{plan.description}</p>
            <button className={`plan-button ${user?.plan === plan.name ? 'current' : ''}`}>
              {user?.plan === plan.name ? 'Current Plan' : 'Choose Plan'}
            </button>
            <ul className="features">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;