import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/extensions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setExtensions(data.extensions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/extensions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setExtensions(extensions.filter((ext) => ext._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Extensions</h1>
          <div className="user-info">
            <p>Plan: <strong>{user?.plan}</strong></p>
            <p>Total Extensions: <strong>{extensions.length}</strong></p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : extensions.length === 0 ? (
          <div className="empty-state">
            <p>No extensions yet. Create your first one!</p>
          </div>
        ) : (
          <div className="extensions-grid">
            {extensions.map((ext) => (
              <div key={ext._id} className="extension-card">
                <h3>{ext.name}</h3>
                <p className="description">{ext.description}</p>
                <div className="extension-meta">
                  <span className="type">{ext.templateType}</span>
                  <span className="generated">{ext.generatedBy}</span>
                </div>
                <div className="extension-actions">
                  {user?.plan === 'Pro' && (
                    <button className="btn-small btn-download">Download</button>
                  )}
                  <button className="btn-small btn-edit">Edit</button>
                  <button
                    className="btn-small btn-delete"
                    onClick={() => handleDelete(ext._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;