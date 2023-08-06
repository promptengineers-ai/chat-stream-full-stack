import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useChatContext } from '../../contexts/ChatContext';

const MessageForm: React.FC = () => {
  const location = useLocation();
  const {loading} = useAppContext();
  const {sendChatPayload, chatPayload, setChatPayload} = useChatContext();
  return (
    <form id="messageForm" className="pb-3">
      <div className="px-3" style={{ width: '100%' }}>
        <div className="input-group" style={{ width: '100%' }}>
          <textarea 
            rows={1}
            id="userInput" 
            className="form-control" 
            placeholder="Type your message here..."
            onChange={(e) => setChatPayload({...chatPayload, query: e.target.value})}
            value={chatPayload.query} 
            disabled={loading}
          ></textarea>
          <button 
            onClick={(e) => {
              e.preventDefault();
              sendChatPayload(location.pathname);
            }}
            id="sendButton"
            disabled={loading}
            type="submit" 
            className="btn btn-primary" 
            style={{ backgroundColor: '#5E35B1', borderColor: '#5E35B1' }}
          >
            {loading ? (
              <div 
                id="spinner" 
                className="spinner-border spinner-border-sm text-light" 
                role="status"
              ></div>
            ) : <i id="sendIcon" className="fa fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </form>
  );
}

export default MessageForm;
