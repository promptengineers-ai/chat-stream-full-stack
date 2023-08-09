import { useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useChatContext } from '../contexts/ChatContext';

const Home: FC = () => {
  const location = useLocation();
  const { setActive } = useAppContext();
  const { resetMessages, userInputRef } = useChatContext();

  useEffect(() => {
    resetMessages();
    userInputRef.current?.focus();
    setActive(false);
  }, [location.pathname]);

  return (
    <div id="chatbox">
    </div>
  );
}

export default Home;