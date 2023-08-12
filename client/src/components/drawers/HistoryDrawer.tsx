import { useEffect, useState } from 'react';
import config from '../../config';
import { useChatContext } from '../../contexts/ChatContext';
import { truncate } from '../../utils';
import { deleteChatHistory, updateChatHistory } from '../../utils/api';
import { constructAssistantMessageDiv, constructUserMessageDiv } from '../../utils/chat';

const HistoryDrawer: React.FC = () => {
  const { histories, updateHistories, chatPayload, setChatPayload, setMessages, messages } = useChatContext();
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState({
    id: '',
    title: '',
    edit: false,
  });
  const [remove, setRemove] = useState({
    id: '',
    status: false,
  });
  
  function selectedCard(selected: boolean) {
    return selected ? '#5E35B1' : 'rgb(23, 25, 35)'
  }

  useEffect(() => {
    open ? updateHistories() : null;
  }, [open])

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        style={{
          zIndex: 20,
          position: 'absolute',
          bottom: '13%',
          right: '0px',
          border: 0,
          backgroundColor: '#5E35B1'
        }}
        onClick={() => open ? setOpen(false) : setOpen(true)}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#historyDrawer"
        aria-controls="historyDrawer"
      >
        <i className="fa fa-history"></i>
      </button>
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="historyDrawer"
        aria-labelledby="historyDrawerLabel"
        style={{ backgroundColor: '#2C313D', color: 'white' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="historyDrawerLabel">
            Histories
          </h5>
          <button
            onClick={() => open ? setOpen(false) : setOpen(true)}
            style={{ backgroundColor: 'white' }}
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {histories.map((item: any) => (
            <div 
              className="card mb-1" 
              key={item._id} 
              style={{ background: selectedCard(chatPayload._id === item._id), color: 'white' }}
            >
              <div className="card-body" style={{ position: 'relative' }}>
                <div 
                  style={{cursor: 'pointer'}} 
                  onClick={() => {
                    setChatPayload({
                      ...chatPayload,
                      _id: item._id,
                      model: item.model,
                      temperature: item.temperature,
                    });
                    setMessages(item.messages);
                    let chatbox = document.getElementById('chatbox') as HTMLDivElement;
                    chatbox.innerHTML = '';
                    // let newMessages = []
                    for (let i = 0; i < item.messages.length; i++) {
                      if (item.messages[i].role === 'user') {

                        let userMessageDiv = constructUserMessageDiv([item.messages[i]]);
                        chatbox.appendChild(userMessageDiv);
                      }
                      if (item.messages[i].role === 'assistant') {
                        let assistantMessageDiv = constructAssistantMessageDiv();
                        assistantMessageDiv.innerHTML = config.marked.parse(item.messages[i].content);
                        chatbox.appendChild(assistantMessageDiv);
                      }
                    }
                    // console.log(newMessages)
                  }}
                >
                  {edit.edit && edit.id === item._id 
                    ? (
                      <input 
                        type="text"  
                        className="form-control-sm form-control" 
                        onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                      /> 
                    )
                    : (item.title || truncate(item.messages[1].content, 35))
                  }
                </div>
                <small style={{ color: 'gray'}}>
                {new Intl.DateTimeFormat('default', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).format(new Date(item.updated_at * 1000))}
                </small>
                <small style={{ position: 'absolute', right: 5, top: 0, color: 'gray' }}>
                  {item.messages.length - 1} <span>messages</span>
                </small>
                {edit.edit && edit.id === item._id || remove.status && remove.id === item._id ? (
                  <>
                  <span 
                    onClick={() => {
                      setEdit({ id: '', title: '', edit: false });
                      setRemove({ id: '', status: false });
                      // setOpen(false);
                    }}
                    className="float-right" 
                    style={{ 
                      bottom: 5, 
                      right: 30, 
                      position: 'absolute', 
                      color: 'red',
                      cursor: 'pointer'
                    }}
                  >
                      <i className="fas fa-times"></i>
                  </span>
                  <span 
                    onClick={() => {
                      if (remove.status) {
                        alert(`Deleting ${item._id}`);
                        deleteChatHistory(item._id);
                        updateHistories();
                        setRemove({ id: '', status: false });
                      }
                      if (edit.edit) {
                        alert(`Updating ${item._id} with ${edit.title}`);
                        updateChatHistory(item._id, { ...item, title: edit.title });
                        updateHistories();
                        setEdit({ title: '', id: '', edit: false });
                      }
                    }}
                    className="float-right" 
                    style={{ 
                      bottom: 5, 
                      right: 5, 
                      position: 'absolute', 
                      color: 'green',
                      cursor: 'pointer'
                    }}
                  >
                      <i className="fa fa-check"></i>
                  </span>
                </>
                ) : (
                  <>
                    <span 
                      onClick={() => {
                        setEdit({ ...edit, id: item._id, edit: true });
                      }}
                      className="float-right" 
                      style={{ 
                        bottom: 5, 
                        right: 30, 
                        position: 'absolute', 
                        color: 'gray',
                        cursor: 'pointer'
                      }}
                    >
                        <i className="fas fa-edit"></i>
                    </span>
                    <span 
                      onClick={() => {
                        setRemove({ id: item._id, status: true });
                      }}
                      className="float-right" 
                      style={{ 
                        bottom: 5, 
                        right: 5, 
                        position: 'absolute', 
                        color: 'gray',
                        cursor: 'pointer'
                      }}
                    >
                        <i className="fa fa-trash"></i>
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
