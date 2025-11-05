import React, { useState, useEffect, useRef } from 'react';
// Try importing from assets, fallback to public folder
import loginBgVideo from '../assets/login-bg.mp4';

const codeChallenges = {
  '1st': {
    language: 'Python',
    code: `def portal_code(n):
    # Write your code here
    return n * 2`
  },
  '2nd': {
    language: 'C',
    code: `int portal_code(int n) {
    // Write your code here
    return n * 2;
}`
  }
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const codeInputRef = useRef(null);

  // Force video to play on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video attributes are set
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.currentTime = 0;
      
      const attemptPlay = () => {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Success - video is playing
              })
              .catch((error) => {
                // Try again after delays
                setTimeout(() => attemptPlay(), 300);
                setTimeout(() => attemptPlay(), 1000);
              });
          }
        }
      };
      
      // Try immediately
      attemptPlay();
      
      // Try when metadata is loaded
      const handleMetadata = () => {
        video.currentTime = 0;
        attemptPlay();
      };
      video.addEventListener('loadedmetadata', handleMetadata);
      
      // Try when video can play
      const handleCanPlay = () => {
        if (video.paused) {
          attemptPlay();
        }
      };
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlay);
      
      // Force play on any user interaction
      const handleInteraction = () => {
        if (video.paused) {
          attemptPlay();
        }
      };
      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      
      // Cleanup
      return () => {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Blur the email input to prevent focus from moving to next input
    e.target.querySelector('input[type="email"]')?.blur();
    
    // Expect emails like 24z368@psgtech.ac.in or 25abc@psgtech.ac.in
    // Local part starts with batch prefix: 24 => 2nd year, 25 => 1st year
    setError('');
    const trimmed = email.trim().toLowerCase();
    const match = /^([0-9]{2}[a-zA-Z0-9_-]*)@([a-z0-9.-]+)$/.exec(trimmed);
    if (!match) {
      setError('Please enter a valid email (e.g. 24z368@psgtech.ac.in)');
      return;
    }

    const local = match[1];
    const domain = match[2];

    if (domain !== 'psgtech.ac.in') {
      setError('Please use your PSG Tech email (e.g. 24z368@psgtech.ac.in)');
      return;
    }

    if (local.startsWith('24')) {
      setYear('2nd');
      setCodeSent(true);
    } else if (local.startsWith('25')) {
      setYear('1st');
      setCodeSent(true);
    } else {
      setError('Unrecognized batch prefix in email. Example: 24z368@psgtech.ac.in (24 → 2nd year, 25 → 1st year)');
    }
  };

  // Prevent auto-focus on code input when it appears
  useEffect(() => {
    if (codeSent && codeInputRef.current) {
      // Ensure the input doesn't have focus when it first appears
      // Blur multiple times to catch any delayed browser auto-focus
      const blurInput = () => {
        if (codeInputRef.current && document.activeElement === codeInputRef.current) {
          codeInputRef.current.blur();
        }
      };
      
      // Blur immediately and on next frames to catch delayed focus
      blurInput();
      setTimeout(blurInput, 0);
      setTimeout(blurInput, 10);
      setTimeout(blurInput, 50);
      setTimeout(blurInput, 100);
      setTimeout(blurInput, 200);
    }
  }, [codeSent]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    // In a real app, verify code sent to email
    if (codeInput === '123456') {
      // Extract roll number from email (e.g., "24z368" from "24z368@psgtech.ac.in")
      const trimmed = email.trim().toLowerCase();
      const match = /^([0-9]{2}[a-zA-Z0-9_-]*)@/.exec(trimmed);
      const rollNumber = match ? match[1].toUpperCase() : '';
      onLogin(year, rollNumber);
    } else {
      setError('Invalid code. Please check your email and try again.');
    }
  };

  return (
    <div className="login-bg">
      <video
        ref={videoRef}
        className="login-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlayThrough={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onPlaying={() => {
          if (videoRef.current) {
            videoRef.current.style.opacity = '1';
            videoRef.current.style.visibility = 'visible';
          }
        }}
        onPause={() => {
          if (videoRef.current && !videoRef.current.ended) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onWaiting={() => {
          // Video buffering - ensure it plays when ready
          if (videoRef.current) {
            videoRef.current.muted = true;
          }
        }}
      >
        <source src={loginBgVideo} type="video/mp4" />
        <source src="/login-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="round-container">
        <div className="login-center">
        <h2 className="title">Enter the Upside Down</h2>
        {!codeSent ? (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 400 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email"
              className="answer-input"
              required
              autoFocus={false}
              style={{ width: '100%', maxWidth: 350, fontSize: '1.1rem', padding: '0.75rem' }}
            />
            <button type="submit" className="submit-button" style={{ width: '100%', maxWidth: 200, fontSize: '1.2rem', padding: '0.75rem' }}>Send Code</button>
          </form>
        ) : (
            <div className="code-challenge" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="answer-input"
                  required
                  autoFocus={false}
                  style={{ width: '100%', maxWidth: 350, fontSize: '1.1rem', padding: '0.75rem' }}
                />
                <button type="submit" className="submit-button" style={{ width: '100%', maxWidth: 200, fontSize: '1.2rem', padding: '0.75rem' }}>Login</button>
              </form>
            </div>
        )}
        {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
