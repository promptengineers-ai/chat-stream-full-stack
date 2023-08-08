import { useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../contexts/ChatContext';

const Home: FC = () => {

  const location = useLocation();
  const { resetMessages } = useChatContext();

  function handleCopyButtonClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('copy-btn')) {
      // 2. Get the code content
      const preElement = (e.target as HTMLElement).closest('pre');
      const codeContent = preElement?.querySelector('code')?.innerText || '';
      console.log(codeContent)
      // 3. Use Clipboard API to copy
      navigator.clipboard.writeText(codeContent).then(() => {
        // Optional: Show a toast or feedback to user saying "Copied to clipboard!"
        alert('Copied to clipboard!');
        return;
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }

  useEffect(() => {
    // 1. Add an event listener on the chatbox
    const chatbox = document.getElementById('chatbox');
    chatbox?.addEventListener('click', handleCopyButtonClick);

    // Cleanup event listener
    return () => {
      chatbox?.removeEventListener('click', handleCopyButtonClick);
    };
  }, []);

  useEffect(() => {
    resetMessages();
  }, [location.pathname]);

  return (
    <div id="chatbox">
    </div>
  );
}

export default Home;