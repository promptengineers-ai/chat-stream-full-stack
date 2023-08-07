import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';

const Agent: React.FC = () => {

  const location = useLocation();
  const { resetMessages } = useChatContext();

  useEffect(() => {
    resetMessages();
  }, [location.pathname]);
  
  return (
    <div id="chatbox">
    </div>
  );
}

export default Agent;
