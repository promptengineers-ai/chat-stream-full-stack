import { useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';

const Home: FC = () => {
  const location = useLocation();
  const { handleChatboxClick, messages, resetMessages, userInputRef } = useChatContext();

  useEffect(() => {
    // 1. Add an event listener on the chatbox
    const chatbox = document.getElementById('chatbox');
    chatbox?.addEventListener('click', handleChatboxClick);
    
    userInputRef.current?.focus();

    // Cleanup event listener
    return () => {
      chatbox?.removeEventListener('click', handleChatboxClick);
    };
  }, [,messages]);

  useEffect(() => {
    resetMessages();
    userInputRef.current?.focus();
  }, [location.pathname]);

  return (
    <div id="chatbox">
    </div>
  );
}

export default Home;