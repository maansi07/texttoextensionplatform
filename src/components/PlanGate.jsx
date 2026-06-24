import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlanGate = ({ requiredPlan, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const planHierarchy = {
    'Starter': 0,
    'Builder': 1,
    'Pro': 2,
  };

  if (!user) {
    return (
      <div className="plan-gate-message">
        <p>Please login to access this feature</p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  if (planHierarchy[user.plan] < planHierarchy[requiredPlan]) {
    return (
      <div className="plan-gate-message">
        <p>This feature requires {requiredPlan} plan</p>
        <button onClick={() => navigate('/pricing')}>Upgrade Plan</button>
      </div>
    );
  }

  return children;
};

export default PlanGate;