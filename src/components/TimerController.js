import React, {useState, useEffect, useRef} from 'react';
import beepSound from '../beep.mp3';
import '../App.css';


const TimerController = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleDecrementClick = (label) => {
    if(label === 'Break' && breakLength > 1) {
      setBreakLength((prevBreakLength) => prevBreakLength - 1);
    } else if (label === 'Session' && sessionLength > 1) {
      setSessionLength((prevSessionLength) => prevSessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);  // Update the time left accordingly
      }
    }
  }

  const handleIncrementClick = (label) => {
    if(label === 'Break' && breakLength < 60) {
      setBreakLength((prevBreakLength) => prevBreakLength + 1);
    } else if (label === 'Session' && sessionLength < 60) {
      setSessionLength((prevSessionLength) => prevSessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);  // Update the time left accordingly
      }
    }
  }

  const handleStartStopClick = () => {
    if (isRunning) {
      // If the timer is running, stop it
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      // If the timer is not running, start it
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
        // When timeLeft becomes 0, switch between session and break
        if (timeLeft === 0) {
          setIsSession(prevIsSession => !prevIsSession);
          setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
        }
      }, 1000);;
      setIsRunning(true);
    }
  };

  const handleResetClick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  useEffect(() => {
    if(isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(timerRef.current);
            let nextIsSession = !isSession;
            setIsSession(nextIsSession);
            audioRef.current.play();
            return nextIsSession ? sessionLength * 60 : breakLength * 60;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    } else {
      if(timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if(timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRunning, isSession, breakLength, sessionLength]);

  return (
    <div id="timercontroller">
      <header><span id="title-number">"25 + 5"</span> Clock</header>
      <div id="timerswitch">
        <button id="start_stop" onClick={handleStartStopClick}>Start/Pause</button>
        <audio id="beep" src={beepSound} ref={audioRef}></audio>
        <div id="time-display">
          <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>      
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>
        <button id="reset" onClick={handleResetClick}>Reset</button>
      </div>
      <div className='length-control-container'>
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <button id="break-increment" onClick={() => handleIncrementClick('Break')}>+</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-decrement" onClick={() => handleDecrementClick('Break')}>-</button>
        </div>
        <div className="length-control">
          <div id="session-label">Session Length</div>
          <button id="session-increment" onClick={() => handleIncrementClick('Session')}>+</button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-decrement" onClick={() => handleDecrementClick('Session')}>-</button>
        </div>
      </div>
      <footer>Created By<br />ZiLong Wang</footer>
    </div>
  );
}

export default TimerController;
