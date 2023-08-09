import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useChatContext } from '../contexts/ChatContext';

const Agent: React.FC = () => {

  const location = useLocation();
  const { resetMessages } = useChatContext();
  const { setActive } = useAppContext();

  useEffect(() => {
    resetMessages();
    
    setActive(false);
  }, [location.pathname]);
  
  return (
    <div id="chatbox">
    </div>
  );
}

export default Agent;
