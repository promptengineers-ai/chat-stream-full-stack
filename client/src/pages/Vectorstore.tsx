import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useChatContext } from '../contexts/ChatContext';

const Vectorstore: FC = () => {

  const location = useLocation();
  const { resetMessages } = useChatContext();
  const { setActive, setLogoText } = useAppContext();

  useEffect(() => {
    resetMessages();
    setActive(false);
    setLogoText('Langchain | Chat Vectorstore');
  }, [location.pathname]);
  
  return (
    <div id="chatbox">
    </div>
  );
}

export default Vectorstore;
