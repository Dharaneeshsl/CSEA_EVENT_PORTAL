import { useState, useEffect } from 'react'
import './App.css'
import RoundOne from './components/RoundOne'
import RoundTwo from './components/RoundTwo'
import RoundThree from './components/RoundThree'
import Login from './components/Login'
// import StrangerThingsIntro from './components/StrangerThingsIntro' // Disabled - using video intro instead
import VideoIntro from './components/VideoIntro'



function App() {
  const [currentRound, setCurrentRound] = useState(1);
  const [loggedInYear, setLoggedInYear] = useState(null);
  const [rollNumber, setRollNumber] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [showIntro, setShowIntro] = useState(false); // Will be set based on localStorage check
  const [loginFadeIn, setLoginFadeIn] = useState(false);

  // On mount, check localStorage for a saved login and intro status
  useEffect(() => {
    try {
      const saved = localStorage.getItem('loggedInYear');
      if (saved) {
        setLoggedInYear(saved);
      }
      const savedRollNumber = localStorage.getItem('rollNumber');
      if (savedRollNumber) {
        setRollNumber(savedRollNumber);
      }
      const savedFragments = localStorage.getItem('passwordFragments');
      if (savedFragments) {
        setFragments(JSON.parse(savedFragments));
      }
      
      // Check if intro has been played before
      const introPlayed = localStorage.getItem('introPlayed');
      if (!introPlayed) {
        // Intro hasn't been played - show it
        setShowIntro(true);
      } else {
        // Intro has been played - skip it and show login immediately
        setShowIntro(false);
        setLoginFadeIn(true);
      }
    } catch (err) {
      // localStorage may be unavailable in some environments; ignore
      // If localStorage fails, show intro by default
      setShowIntro(true);
    }
  }, []);

  // Save fragments to localStorage whenever they change
  useEffect(() => {
    if (fragments.length > 0) {
      try {
        localStorage.setItem('passwordFragments', JSON.stringify(fragments));
      } catch (e) {
        // ignore
      }
    }
  }, [fragments]);

  // Debug: confirm component renders in the browser console
  console.log('App mounted, currentRound=', currentRound);

  // Show intro sequence first, but render login behind it (visible through O's hole)
  if (!loggedInYear) {
    return (
      <>
        {/* Login page - naturally emerges from black background */}
        <div className={`app-container login-mode ${showIntro && !loginFadeIn ? 'login-hidden' : 'login-visible'}`} style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          zIndex: showIntro && !loginFadeIn ? 9998 : 10000,
          transition: 'opacity 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ease-in-out'
        }}>
          <Login onLogin={(year, rollNum) => {
            setLoggedInYear(year);
            setRollNumber(rollNum);
            try { 
              localStorage.setItem('loggedInYear', year);
              if (rollNum) localStorage.setItem('rollNumber', rollNum);
            } catch (e) { /* ignore */ }
          }} />
          <footer className="footer">
            <p>CSEA Event Portal - Stranger Things Edition</p>
          </footer>
        </div>
        
        {/* Video Intro - Stranger Things intro */}
        {showIntro && (
          <VideoIntro 
            onComplete={() => {
              setShowIntro(false);
              // Mark intro as played in localStorage
              try {
                localStorage.setItem('introPlayed', 'true');
              } catch (e) {
                // ignore
              }
            }} 
            onFadeInLogin={() => setLoginFadeIn(true)}
          />
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      {/* User Roll Number Display - Top Right */}
      {rollNumber && (
        <div className="user-roll-badge">
          <span className="user-label">USER:</span>
          <span className="user-roll-number">{rollNumber}</span>
        </div>
      )}
      <main className="main-content">
        {(() => {
          switch (currentRound) {
            case 1:
              return <RoundOne onComplete={() => {
                setCurrentRound(2);
              }} />;
            case 2:
              return <RoundTwo 
                loggedInYear={loggedInYear}
                fragments={fragments}
                setFragments={setFragments}
                onComplete={() => {
                  setCurrentRound(3);
                }} 
              />;
            case 3:
              return <RoundThree fragments={fragments} />;
            default:
              return <RoundOne />;
          }
        })()}
      </main>

      {currentRound !== 2 && (
        <footer className="footer">
          <p>CSEA Event Portal - Stranger Things Edition</p>
        </footer>
      )}
    </div>
  );
}

export default App;
