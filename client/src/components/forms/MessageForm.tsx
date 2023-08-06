import React from 'react';

const MessageForm: React.FC = () => {
  return (
    <form id="messageForm" className="mb-3">
      <div className="px-3" style={{ width: '100%' }}>
        <div className="input-group" style={{ width: '100%' }}>
          <textarea 
            rows={1}
            id="userInput" 
            className="form-control" 
            placeholder="Type your message here..." 
          ></textarea>
          <button 
            id="sendButton"
            type="submit" 
            className="btn btn-primary" 
            style={{ backgroundColor: '#5E35B1', borderColor: '#5E35B1' }}
          >
            <i id="sendIcon" className="fa fa-paper-plane"></i>
            <div id="spinner" className="spinner-border spinner-border-sm text-light" role="status" style={{ display: 'none' }}></div>
          </button>
        </div>
      </div>
    </form>
  );
}

export default MessageForm;
