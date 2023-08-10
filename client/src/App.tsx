import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Import your components here
import Home from './pages/Home';
import Function from './pages/Function';
import Vectorstore from './pages/Vectorstore';
import Agent from './pages/Agent';


// Context Providers
import SourcesProvider from './contexts/SourcesContext';
import ChatProvider from './contexts/ChatContext';
import AppProvider from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <SourcesProvider>
        <ChatProvider>
          <Router>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/functions" element={<Function />} />
                <Route path="/vectorstore" element={<Vectorstore />} />
                <Route path="/agent" element={<Agent />} />
                {/* You can add more Route components here for your different pages */}
              </Routes>
            </MainLayout>
          </Router>
        </ChatProvider>
      </SourcesProvider>
    </AppProvider>
  );
}

export default App;
