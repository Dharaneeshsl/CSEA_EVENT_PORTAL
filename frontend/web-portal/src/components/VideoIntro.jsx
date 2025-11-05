import React, { useState, useEffect, useRef } from 'react';
import strangerIntroVideo from '../assets/stranger-intro.mp4';
import './VideoIntro.css';

const VideoIntro = ({ onComplete, onFadeInLogin }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const videoDurationRef = useRef(0);
  const loginFadeStartedRef = useRef(false);

  // Handle user interaction (touch or click)
  const handleInteraction = async () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      
      // Request fullscreen
      try {
        const container = document.documentElement;
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen error:', err);
        // Continue even if fullscreen fails
      }
      
      // Hide cursor
      document.body.style.cursor = 'none';
      
      // Play both video and audio when user interacts
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.error('Video play error:', err));
      }
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.error('Audio play error:', err));
      }
    }
  };

  // Set up video metadata and sync
  useEffect(() => {
    if (isComplete) {
      // If already complete, stop everything immediately
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
        audio.volume = 0;
      }
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.currentTime = 0;
      }
      return;
    }
    
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    const handleVideoLoadedMetadata = () => {
      videoDurationRef.current = video.duration;
      
      // Sync audio to video duration
      if (audio) {
        // Ensure audio track is ready
        audio.addEventListener('loadedmetadata', () => {
          console.log('Video duration:', video.duration);
        });
      }
    };

    const handleTimeUpdate = () => {
      if (hasInteracted && videoDurationRef.current > 0) {
        const currentTime = video.currentTime;
        const totalDuration = videoDurationRef.current;
        
        // Hide video and trigger login fade-in 7 seconds before the end
        if (totalDuration - currentTime <= 7 && !videoHidden) {
          setVideoHidden(true);
          
          // Show cursor and exit fullscreen when login starts fading in
          document.body.style.cursor = '';
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } catch (err) {
            console.log('Exit fullscreen error:', err);
          }
          
          // Ensure video continues playing (just hidden visually)
          // Audio will continue syncing via the sync interval
          if (video.paused) {
            video.play().catch(err => console.error('Video continue play error:', err));
          }
          
          // Trigger login fade-in callback (7 seconds before video ends)
          if (onFadeInLogin && !loginFadeStartedRef.current) {
            loginFadeStartedRef.current = true;
            onFadeInLogin();
          }
        }
      }
    };

    const handleVideoEnded = () => {
      // Stop audio immediately when video ends
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
        audio.volume = 0;
      }
      
      // Stop video
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      
      // Show cursor and exit fullscreen
      document.body.style.cursor = '';
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err) {
        console.log('Exit fullscreen error:', err);
      }
      
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    };

    // Also handle audio ending
    const handleAudioEnded = () => {
      // Stop audio completely
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
        audio.volume = 0;
      }
      
      // Stop video
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      
      // Show cursor and exit fullscreen
      document.body.style.cursor = '';
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err) {
        console.log('Exit fullscreen error:', err);
      }
      
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);
    
    if (audio) {
      audio.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [hasInteracted, videoHidden, onComplete, isComplete]);

  // Sync audio with video playback
  useEffect(() => {
    if (!hasInteracted || isComplete) return;

    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Sync audio when video plays/pauses
    const handleVideoPlay = () => {
      if (audio.paused) {
        audio.currentTime = video.currentTime;
        audio.play().catch(err => console.error('Audio sync play error:', err));
      }
    };

    const handleVideoPause = () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = video.currentTime;
      }
    };

    const handleVideoSeeked = () => {
      audio.currentTime = video.currentTime;
    };

    const syncInterval = setInterval(() => {
      if (!video.paused && !audio.paused) {
        // Keep audio synced with video
        const timeDiff = Math.abs(audio.currentTime - video.currentTime);
        if (timeDiff > 0.15) {
          audio.currentTime = video.currentTime;
        }
      }
      // If video is hidden but still playing, ensure audio continues and stays synced
      if (videoHidden && !video.paused) {
        if (audio.paused) {
          audio.currentTime = video.currentTime;
          audio.play().catch(err => console.error('Audio continue play error:', err));
        } else {
          // Keep audio synced with hidden video
          const timeDiff = Math.abs(audio.currentTime - video.currentTime);
          if (timeDiff > 0.15) {
            audio.currentTime = video.currentTime;
          }
        }
      }
    }, 100);

    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('seeked', handleVideoSeeked);

    return () => {
      clearInterval(syncInterval);
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('seeked', handleVideoSeeked);
    };
  }, [hasInteracted, videoHidden]);

  // Cleanup: stop all audio/video and restore cursor when component unmounts
  useEffect(() => {
    return () => {
      // Stop and clean up audio
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
        audio.volume = 0;
        audio.src = '';
        audio.load();
      }
      
      // Stop and clean up video
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.currentTime = 0;
        video.muted = true;
        video.src = '';
        video.load();
      }
      
      // Restore cursor
      document.body.style.cursor = '';
      
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err) {
        // ignore
      }
    };
  }, []);

  if (isComplete) {
    return null;
  }

  return (
    <div 
      className={`video-intro-container ${videoHidden ? 'video-hidden' : ''}`}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      style={{ cursor: hasInteracted ? 'none' : 'pointer' }}
    >
      {/* Video element - muted, for visual only */}
      <video
        ref={videoRef}
        className={`intro-video ${videoHidden ? 'hidden' : ''}`}
        src={strangerIntroVideo}
        muted
        playsInline
        preload="auto"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: videoHidden ? -1 : 9999,
          opacity: videoHidden ? 0 : 1,
          transition: 'opacity 0.5s ease-out'
        }}
      />

      {/* Audio element - hidden, for sound only */}
      <audio
        ref={audioRef}
        src={strangerIntroVideo}
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Instruction overlay - show until user interacts */}
      {!hasInteracted && (
        <div 
          className="intro-instruction"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            fontSize: '1.5rem',
            zIndex: 10000,
            textAlign: 'center',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          Tap to start
        </div>
      )}
    </div>
  );
};

export default VideoIntro;

