import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useChatContext } from '../contexts/ChatContext';

const Function: FC = () => {

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

export default Function;
