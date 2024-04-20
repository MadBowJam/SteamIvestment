import React, { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const timeout = 10_000;
const promptBeforeIdle = 1_000;

const IdleTimer = () => {
  const [state, setState] = useState('Active');
  const [remaining, setRemaining] = useState(timeout);
  
  const onIdle = () => {
    setState('Idle');
    toast.info("Ви неактивні");
  };
  
  const onActive = () => {
    setState('Active');
  };
  
  const onPrompt = () => {
    setState('Prompted');
  };
  
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime]);
  
  const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0);
  
  return (
    <>
      <p>Current State: {state}</p>
      {timeTillPrompt > 0 && (
        <p>
          {timeTillPrompt} seconds until prompt
        </p>
      )}
    </>
  );
};

export default IdleTimer;
