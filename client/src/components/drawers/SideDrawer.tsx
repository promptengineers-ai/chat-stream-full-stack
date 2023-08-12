import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../../contexts/ChatContext';
import { useSourcesContext } from '../../contexts/SourcesContext';

const SideDrawer: React.FC = () => {
  const location = useLocation();
  const { retrieveSources, sources } = useSourcesContext();
  const { chatPayload, setChatPayload } = useChatContext();
  // Create a state object to hold the selected values
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      retrieveSources();
    }
  }, [open, retrieveSources])

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        style={{
          zIndex: 20,
          position: 'absolute',
          bottom: '8%',
          right: '0px',
          border: 0,
          backgroundColor: '#5E35B1'
        }}
        onClick={() => open ? setOpen(false) : setOpen(true)}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <i className="fa fa-cogs"></i>
      </button>
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
        style={{ backgroundColor: '#2C313D', color: 'white' }}
      >
        <div className="offcanvas-header" style={{ marginRight: '10px' }}>
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Settings
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
        <div className="offcanvas-body" style={{ marginRight: '10px' }}>
          {location.pathname === '/vectorstore' && (
            <div className="mb-2">
              <label className="form-label">Select Source:</label>
              <select 
                id="selectSource" 
                style={{ width: '100%', padding: '5px' }}
                onChange={(e) => {
                  setChatPayload({...chatPayload, vectorestore: e.target.value});
                  localStorage.setItem('source', e.target.value);
                }}
                value={chatPayload.vectorestore}
              >
                {sources.map((source: string, index: number) => (
                  <option key={index} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-2">
            <label className="form-label">Select the model type:</label>
            <select 
              id="modelType" 
              style={{ width: '100%', padding: '5px' }}
              onChange={(e) => {
                setChatPayload({...chatPayload, model: e.target.value});
                localStorage.setItem('model', e.target.value);
              }}
              value={chatPayload.model}
            >
              <option value="gpt-3.5-turbo">GPT 3.5</option>
              <option value="gpt-3.5-turbo-16k">GPT 3.5 16k</option>
              <option value="gpt-4">GPT 4</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Set the system message:</label>
            <textarea
              id="systemMessage"
              rows={4}
              style={{ width: '100%', padding: '5px', maxHeight: 'max-content' }}
              onChange={(e) => {
                setChatPayload({...chatPayload, systemMessage: e.target.value})
                localStorage.setItem('systemMessage', e.target.value);
              }}
              value={chatPayload.systemMessage}
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
