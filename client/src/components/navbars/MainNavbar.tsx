import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';


export default function MainNavbar() {
  const {active, setActive, logoText} = useAppContext();

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark px-4 fixed-top">
      <Link className="navbar-brand" to="/">
        <img src="/icon.png" alt="" width="40px"/>
        <span className='ml-2'>{logoText}</span>
      </Link>
      <button 
        onClick={() => setActive(!active)}
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div 
        className={`collapse navbar-collapse ${active ? 'show' : null}`} 
        id="navbarNav" 
      >
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              OpenAI
            </button>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/">Chat GPT</Link></li>
              <li><Link className="dropdown-item" to="/functions">Chat Functions</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Langchain
            </button>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/agent">Chat Agent</Link></li>
                <li><Link className="dropdown-item" to="/vectorstore">Chat Vector Store</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Docs
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="http://localhost:8000/docs">Swagger</a></li>
                <li><a className="dropdown-item" href="http://localhost:8000/redoc">Redoc</a></li>
            </ul>
          </li>
        </ul>
        <div className="ms-auto">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="https://github.com/promptengineers-ai/chat-stream-full-stack" target="_blank" rel="noreferrer">
                <i 
                className="fab fa-github" 
                style={{
                  fontSize: "28px", color: "white"
                }}
                ></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}