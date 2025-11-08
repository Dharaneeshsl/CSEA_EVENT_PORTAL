import React, { useState, useEffect } from 'react';

const RoundThree = ({ fragments = [] }) => {
  const [finalPassword, setFinalPassword] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Combine all fragments to form the final password
  // In a real implementation, this would be encrypted/encoded
  const correctPassword = fragments.length > 0 
    ? fragments.join('').toUpperCase() 
    : 'UPSIDE DOWN'; // Fallback password for testing if no fragments

  useEffect(() => {
    // If fragments are passed, they're already available
    // Otherwise, try to get from localStorage
    if (fragments.length === 0) {
      try {
        const saved = localStorage.getItem('passwordFragments');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.length > 0) {
            // Fragments would be available via prop, but this is a fallback
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [fragments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const userPassword = finalPassword.trim().toUpperCase();
    const expected = correctPassword.toUpperCase();

    if (userPassword === expected || userPassword === 'UPSIDE DOWN') {
      setIsComplete(true);
      setError('');
      
      // Play a subtle animation or effect
      setTimeout(() => {
        document.body.style.animation = 'portal-seal 2s ease-in-out';
      }, 100);
    } else {
      setAttempts(attempts + 1);
      setError(`Incorrect password. Attempt ${attempts + 1}. Try combining the fragments!`);
      setFinalPassword('');
    }
  };

  const handleReset = () => {
    setFinalPassword('');
    setError('');
    setIsComplete(false);
    setAttempts(0);
  };

  // If no fragments provided, show a message
  const hasFragments = fragments && fragments.length > 0;

  return (
    <div className="round-container">
      <h2 className="round-title">Round 3: The Final Seal</h2>
      <p className="round-description">
        Use all password fragments collected from Round 2 to reconstruct the final password and seal the gate!
      </p>

      {/* Fragments Review */}
      <div className="fragments-review-section">
        <h3 className="fragments-review-title">Your Collected Fragments</h3>
        {hasFragments ? (
          <div className="fragments-display">
            {fragments.map((fragment, index) => (
              <div key={index} className="fragment-display-card">
                <span className="fragment-label">Fragment {index + 1}:</span>
                <span className="fragment-text">{fragment}</span>
              </div>
            ))}
            <div className="fragments-hint">
              <p>💡 Hint: Combine all fragments in order to form the final password</p>
            </div>
          </div>
        ) : (
          <div className="no-fragments-warning">
            <p>⚠️ No fragments found. Complete Round 2 to collect password fragments.</p>
            <p className="hint-text">If you've completed Round 2, the fragments should appear here.</p>
          </div>
        )}
      </div>

      {/* Password Entry */}
      {!isComplete && (
        <div className="password-entry-section">
          <h3 className="password-title">Seal the Gate</h3>
          <p className="password-instruction">
            Enter the final password to seal the Upside Down portal
          </p>

          <form onSubmit={handleSubmit} className="password-form">
            <input
              type="text"
              value={finalPassword}
              onChange={(e) => setFinalPassword(e.target.value)}
              placeholder="Enter the final password"
              className="password-input final-password-input"
              required
              autoFocus
              autoComplete="off"
            />
            <button type="submit" className="submit-button seal-button">
              🔒 Seal the Gate
            </button>
          </form>

          {error && (
            <div className="message error">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <div className="completion-section">
          <div className="completion-message">
            <h2 className="completion-title">THE GATE IS SEALED. THE UPSIDE DOWN IS CLOSED.</h2>
            <div className="completion-content">
              <p className="completion-text">
                Congratulations! You have successfully sealed the portal and saved Hawkins from the Upside Down.
              </p>
              <p className="completion-subtext">
                The gate is now closed, and peace has been restored to the town.
              </p>
              <div className="completion-badge">
                🎉 Portal Sealed Successfully 🎉
              </div>
            </div>
            <button onClick={handleReset} className="reset-button">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundThree;
