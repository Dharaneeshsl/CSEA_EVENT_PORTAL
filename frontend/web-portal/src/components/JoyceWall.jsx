import React, { useState, useEffect, useRef, useCallback } from 'react';
import './JoyceWall.css';
import joyceWallVideo from '../assets/joycewall.mp4';
import finaleVideo from '../assets/stranger-things-finale.mp4';
// Import background music files (add these audio files to your assets folder)
// import narrativeMusic from '../assets/narrative-music.mp3';
// import joyceWallMusic from '../assets/joyce-wall-music.mp3';

export default function JoyceWall({ triggerWord, onComplete, fragments = [] }) {
  const [showJumbledMessage, setShowJumbledMessage] = useState(false);
  const [showJoyceWallVideo, setShowJoyceWallVideo] = useState(false);
  const [showFinaleVideo, setShowFinaleVideo] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showJoyceWallMessage, setShowJoyceWallMessage] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [joyceWallVideoComplete, setJoyceWallVideoComplete] = useState(false);
  const joyceWallVideoRef = useRef(null);
  const finaleVideoRef = useRef(null);
  const narrativeMusicRef = useRef(null);
  const joyceWallMusicRef = useRef(null);
  
  // Calculate correct password from fragments
  const correctPassword = fragments.length > 0 
    ? fragments.join('').toUpperCase() 
    : 'UPSIDE DOWN';
  
  // Time to pause finale video (when Eleven starts using power) - adjust this value
  const PAUSE_TIME = 8; // seconds - adjust based on your video

  const [canContinue, setCanContinue] = useState(false);

  // Phase 1: Show narrative message first, then allow user to continue
  useEffect(() => {
    if (triggerWord) {
      setShowJumbledMessage(true);
      // Play narrative background music
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.volume = 0.5; // Set volume (0.0 to 1.0)
        narrativeMusicRef.current.loop = true; // Loop the music
        narrativeMusicRef.current.play().catch(error => {
          console.error('Error playing narrative music:', error);
        });
      }
      // Enable continue button after a short delay (give time to read)
      const enableTimer = setTimeout(() => {
        setCanContinue(true);
      }, 2000);
      return () => clearTimeout(enableTimer);
    }
  }, [triggerWord]);

  // Handle continue from narrative to JoyceWall video
  const handleContinueToJoyceWall = () => {
    if (canContinue) {
      // Stop narrative music
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.pause();
        narrativeMusicRef.current.currentTime = 0;
      }
      setShowJumbledMessage(false);
      setCanContinue(false);
      setShowJoyceWallVideo(true);
      // Play Joyce wall background music
      if (joyceWallMusicRef.current) {
        joyceWallMusicRef.current.volume = 0.5; // Set volume (0.0 to 1.0)
        joyceWallMusicRef.current.loop = true; // Loop the music
        joyceWallMusicRef.current.play().catch(error => {
          console.error('Error playing Joyce wall music:', error);
        });
      }
    }
  };

  // Handle JoyceWall video end - show message and enable continue
  const handleJoyceWallVideoEnd = () => {
    setIsPlaying(false);
    setJoyceWallVideoComplete(true);
    setShowJoyceWallMessage(true);
  };

  // Handle continue from JoyceWall to finale video
  const handleContinueToFinale = () => {
    // Stop Joyce wall music
    if (joyceWallMusicRef.current) {
      joyceWallMusicRef.current.pause();
      joyceWallMusicRef.current.currentTime = 0;
    }
    setShowJoyceWallVideo(false);
    setShowJoyceWallMessage(false);
    // Transition to finale video after a short delay
    setTimeout(() => {
      setShowFinaleVideo(true);
    }, 500);
  };

  // Handle replay JoyceWall video
  const handleReplayJoyceWall = () => {
    if (joyceWallVideoRef.current) {
      setShowJoyceWallMessage(false);
      setJoyceWallVideoComplete(false);
      joyceWallVideoRef.current.currentTime = 0;
      playJoyceWallVideo();
    }
  };

  // Handle JoyceWall video loaded metadata
  const handleJoyceWallVideoLoaded = useCallback(() => {
    if (joyceWallVideoRef.current && showJoyceWallVideo) {
      playJoyceWallVideo();
    }
  }, [showJoyceWallVideo]);

  // Play JoyceWall video
  const playJoyceWallVideo = useCallback(async () => {
    if (joyceWallVideoRef.current) {
      try {
        setIsPlaying(true);
        await joyceWallVideoRef.current.play();
      } catch (error) {
        console.error('Error playing JoyceWall video:', error);
        setIsPlaying(false);
      }
    }
  }, []);

  // Start JoyceWall video when it becomes visible
  useEffect(() => {
    if (showJoyceWallVideo && joyceWallVideoRef.current) {
      if (joyceWallVideoRef.current.readyState >= 2) {
        playJoyceWallVideo();
      }
    }
  }, [showJoyceWallVideo, playJoyceWallVideo]);

  // Play finale video function
  const playFinaleVideo = useCallback(async () => {
    if (finaleVideoRef.current) {
      try {
        setIsPlaying(true);
        setVideoPaused(false);
        await finaleVideoRef.current.play();
      } catch (error) {
        console.error('Error playing finale video:', error);
        setIsPlaying(false);
      }
    }
  }, []);

  // Check if password was already cracked on mount
  useEffect(() => {
    try {
      const alreadyCracked = localStorage.getItem('round3PasswordCracked');
      if (alreadyCracked === 'true') {
        // Password already cracked - don't show password input, just play video
        setShowPasswordInput(false);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Handle finale video time update - pause at specific time
  const handleFinaleTimeUpdate = useCallback(() => {
    // Check if password was already cracked - if so, don't pause
    try {
      const alreadyCracked = localStorage.getItem('round3PasswordCracked');
      if (alreadyCracked === 'true') {
        // Password already cracked - let video continue playing
        return;
      }
    } catch (e) {
      // ignore
    }
    
    if (finaleVideoRef.current && finaleVideoRef.current.currentTime >= PAUSE_TIME && !videoPaused && !showPasswordInput) {
      finaleVideoRef.current.pause();
      setVideoPaused(true);
      setIsPlaying(false);
      setShowPasswordInput(true);
    }
  }, [PAUSE_TIME, videoPaused, showPasswordInput]);

  // Handle finale video end - game is complete!
  const handleFinaleVideoEnd = () => {
    setIsPlaying(false);
    // Show completion message for a moment, then call onComplete
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 2000);
  };

  // Handle finale video loaded metadata - start playing
  const handleFinaleVideoLoaded = useCallback(() => {
    if (finaleVideoRef.current && showFinaleVideo) {
      playFinaleVideo();
    }
  }, [showFinaleVideo, playFinaleVideo]);

  // Start finale video when it becomes visible
  useEffect(() => {
    if (showFinaleVideo && finaleVideoRef.current) {
      if (finaleVideoRef.current.readyState >= 2) {
        playFinaleVideo();
      }
    }
  }, [showFinaleVideo, playFinaleVideo]);

  // Handle password submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    
    const userPassword = password.trim().toUpperCase();
    const expected = correctPassword.toUpperCase();
    
    if (userPassword === expected || userPassword === 'UPSIDE DOWN') {
      // Correct password - save to localStorage and resume finale video
      try {
        localStorage.setItem('round3PasswordCracked', 'true');
      } catch (e) {
        // ignore
      }
      setShowPasswordInput(false);
      setVideoPaused(false);
      if (finaleVideoRef.current) {
        finaleVideoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setPasswordError('Incorrect password. Try again!');
      setPassword('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (joyceWallVideoRef.current) {
        joyceWallVideoRef.current.pause();
        joyceWallVideoRef.current.currentTime = 0;
      }
      if (finaleVideoRef.current) {
        finaleVideoRef.current.pause();
        finaleVideoRef.current.currentTime = 0;
      }
      if (narrativeMusicRef.current) {
        narrativeMusicRef.current.pause();
        narrativeMusicRef.current.currentTime = 0;
      }
      if (joyceWallMusicRef.current) {
        joyceWallMusicRef.current.pause();
        joyceWallMusicRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="joyce-wall-container">
      {/* Background Music - Narrative Message */}
      {/* Uncomment the import statements at the top and add your audio files to use background music */}
      <audio
        ref={narrativeMusicRef}
        preload="auto"
        loop
        style={{ display: 'none' }}
      >
        {/* Once you add narrative-music.mp3 to assets folder, uncomment the import and this source tag */}
        {/* <source src={narrativeMusic} type="audio/mpeg" /> */}
        {/* <source src={narrativeMusic} type="audio/ogg" /> */}
      </audio>

      {/* Background Music - Joyce Wall Video */}
      <audio
        ref={joyceWallMusicRef}
        preload="auto"
        loop
        style={{ display: 'none' }}
      >
        {/* Once you add joyce-wall-music.mp3 to assets folder, uncomment the import and this source tag */}
        {/* <source src={joyceWallMusic} type="audio/mpeg" /> */}
        {/* <source src={joyceWallMusic} type="audio/ogg" /> */}
      </audio>

      {/* Narrative Message - Explanation */}
      {showJumbledMessage && (
        <div className="jumbled-message-overlay">
          <div className="jumbled-message-content">
            <div className="narrative-title">MESSAGE FROM THE UPSIDE DOWN</div>
            <div className="narrative-text">
              <p>A message has emerged from the Upside Down—scrambled and distorted by the dimensional rift between worlds.</p>
              <p>This message contains vital information that will help Eleven close the gate and seal the portal once and for all.</p>
              <p>Watch carefully as the transmission reveals itself. Use the knowledge you've gathered to assist Eleven in her final stand against the darkness.</p>
            </div>
            {canContinue && (
              <button 
                onClick={handleContinueToJoyceWall}
                className="tap-to-continue-button"
              >
                Tap to Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Phase 1: JoyceWall Video */}
      {showJoyceWallVideo && (
        <>
          <video 
            ref={joyceWallVideoRef}
            src={joyceWallVideo}
            className="joyce-wall-video"
            onLoadedMetadata={handleJoyceWallVideoLoaded}
            onEnded={handleJoyceWallVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            preload="auto"
            muted={false}
          />
          
          {/* Message Received after JoyceWall video */}
          {showJoyceWallMessage && (
            <div className="message-received">
              <h2>Message Received</h2>
            </div>
          )}

          {/* Control Buttons for JoyceWall Video */}
          <div className="joyce-wall-controls">
            <button 
              onClick={handleReplayJoyceWall}
              className="replay-button"
              disabled={isPlaying}
            >
              <span className="button-icon">↻</span>
              <span className="button-text">REPLAY</span>
            </button>
            {showJoyceWallMessage && joyceWallVideoComplete && (
              <button 
                onClick={handleContinueToFinale}
                className="continue-button"
              >
                <span className="button-text">CONTINUE</span>
                <span className="button-icon">→</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Phase 2: Finale Video */}
      {showFinaleVideo && (
        <video 
          ref={finaleVideoRef}
          src={finaleVideo}
          className="joyce-wall-video"
          onLoadedMetadata={handleFinaleVideoLoaded}
          onTimeUpdate={handleFinaleTimeUpdate}
          onEnded={handleFinaleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          preload="auto"
          muted={false}
        />
      )}

      {/* Password Input Overlay - Game-like UI */}
      {showPasswordInput && (
        <div className="password-overlay">
          <div className="password-overlay-content">
            <div className="password-title-section">
              <div className="password-round-label">ROUND 3: THE FINAL SEAL</div>
              <h2 className="password-title">ELEVEN NEEDS YOUR HELP</h2>
              <p className="password-subtitle">Enter the password to close the gate</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="password-form-overlay">
              <div className="password-input-wrapper">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="password-input-game"
                  autoFocus
                  autoComplete="off"
                  required
                />
                {passwordError && (
                  <div className="password-error">{passwordError}</div>
                )}
              </div>
              
              <button type="submit" className="password-submit-button">
                <span className="button-text">SEAL THE GATE</span>
                <span className="button-icon">🔒</span>
              </button>
            </form>

            {/* Show fragments hint */}
            {fragments.length > 0 && (
              <div className="fragments-hint-overlay">
                <div className="fragments-hint-label">Your Fragments:</div>
                <div className="fragments-display-overlay">
                  {fragments.map((fragment, index) => (
                    <span key={index} className="fragment-badge">{fragment}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
