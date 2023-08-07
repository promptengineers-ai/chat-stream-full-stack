import { useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';

const Home: FC = () => {

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

export default Home;