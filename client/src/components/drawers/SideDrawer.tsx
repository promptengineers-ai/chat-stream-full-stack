import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSourcesContext } from '../../contexts/SourcesContext';

const SideDrawer: React.FC = () => {
  const location = useLocation();
  const { retrieveSources, sources } = useSourcesContext();
  // Create a state object to hold the selected values
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    selectedSource: '',
    selectedModelType: '',
    systemMessage: '',
  });

  const handleSaveClick = () => {
    // Get the selected values from the DOM
    const sourceSelect = document.getElementById('selectSource') as HTMLSelectElement;
    const modelTypeSelect = document.getElementById('modelType') as HTMLSelectElement;
    const systemMessageInput = document.getElementById('systemMessage') as HTMLTextAreaElement;

    // Update the state object with the selected values
    setSettings({
      selectedSource: sourceSelect.value,
      selectedModelType: modelTypeSelect.value,
      systemMessage: systemMessageInput.value,
    });
    alert(JSON.stringify(settings))
  };

  useEffect(() => {
    if (open) {
      retrieveSources();
    }
  }, [retrieveSources, open])

  return (
    <>
      <button
        className="btn btn-primary"
        style={{
          zIndex: 20,
          position: 'absolute',
          bottom: '60%',
          right: '0px',
          border: '0',
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
              <select id="selectSource" style={{ width: '100%', padding: '5px' }}>
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
            <select id="modelType" style={{ width: '100%', padding: '5px' }}>
              <option value="gpt-3.5-turbo">GPT 3.5</option>
              <option value="gpt-3.5-turbo-16k">GPT 3.5 16k</option>
              <option value="gpt-4">GPT 4</option>
              {/* Add as many options as you need */}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Set the system message:</label>
            <textarea
              id="systemMessage"
              rows={4}
              style={{ width: '100%', padding: '5px', maxHeight: 'max-content' }}
            ></textarea>
            <button
              id="setSystemMessage"
              className="btn btn-primary mt-2"
              style={{ backgroundColor: '#5E35B1', borderColor: '#5E35B1' }}
              onClick={handleSaveClick} // Call the handleSaveClick function when the button is clicked
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
