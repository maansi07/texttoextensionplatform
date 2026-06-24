import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PlanGate from '../components/PlanGate';
import '../styles/GeneratorPage.css';

const GeneratorPage = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [templateType, setTemplateType] = useState('popup');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description');
      return;
    }

    // Check if user has AI generation capability
    if (user.plan === 'Starter') {
      alert('AI generation is only available for Builder and Pro plans');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/extensions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: `Extension from: ${prompt.substring(0, 30)}...`,
          description: prompt,
          templateType,
          generatedBy: 'ai',
          aiPrompt: prompt,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedCode(data.extension);
        setPrompt('');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating extension');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator-page">
      <div className="generator-container">
        <h1>Extension Generator</h1>

        <div className="generator-form">
          <div className="form-section">
            <label>Template Type</label>
            <select value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
              <option value="popup">Popup</option>
              <option value="sidepanel">Side Panel</option>
              <option value="actionMenu">Action Menu</option>
            </select>
          </div>

          <PlanGate requiredPlan="Builder">
            <div className="form-section">
              <label>Describe Your Extension</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Create a todo list extension that saves tasks locally..."
                rows="6"
              />
              <button onClick={handleGenerate} disabled={loading} className="btn btn-primary">
                {loading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </PlanGate>
        </div>

        {generatedCode && (
          <div className="generated-code">
            <h2>Generated Extension</h2>
            <div className="code-tabs">
              <div className="code-section">
                <h3>HTML</h3>
                <pre>
                  <code>{generatedCode.code?.html || 'No HTML generated'}</code>
                </pre>
              </div>
              <div className="code-section">
                <h3>CSS</h3>
                <pre>
                  <code>{generatedCode.code?.css || 'No CSS generated'}</code>
                </pre>
              </div>
              <div className="code-section">
                <h3>JavaScript</h3>
                <pre>
                  <code>{generatedCode.code?.js || 'No JS generated'}</code>
                </pre>
              </div>
            </div>
            <div className="code-actions">
              <PlanGate requiredPlan="Pro">
                <button className="btn btn-primary">Download ZIP</button>
              </PlanGate>
              <button className="btn btn-secondary">Save Extension</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;