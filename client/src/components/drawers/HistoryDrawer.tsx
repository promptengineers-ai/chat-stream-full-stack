import { useEffect, useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { truncate } from '../../utils';

const HistoryDrawer: React.FC = () => {
  const { histories, updateHistories } = useChatContext();
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState({
    id: '',
    edit: false,
  });

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
              style={{ background: 'rgb(23, 25, 35)', color: 'white' }}
            >
              <div className="card-body" style={{ position: 'relative' }}>
                {truncate(item.messages[1].content, 35)}<br/>
                <small style={{ color: 'gray'}}>{item.updated_at}</small>
                <small style={{ position: 'absolute', right: 5, top: 0, color: 'gray' }}>
                  {item.messages.length} <span>messages</span>
                </small>
                {edit.edit && edit.id === item._id ? (
                  <span 
                    onClick={() => {
                      setEdit({ id: '', edit: false });
                      // setOpen(false);
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
                ) : (
                  <>
                    <span 
                      onClick={() => {
                        setEdit({ id: item._id, edit: true });
                        // setOpen(false);
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
                        setEdit({ id: '', edit: false });
                        // setOpen(false);
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
