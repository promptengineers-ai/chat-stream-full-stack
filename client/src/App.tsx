import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components here
import Home from './pages/Home';
import Vectorstore from './pages/Vectorstore';
import MainLayout from './layouts/MainLayout';

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
                <Route path="/vectorstore" element={<Vectorstore />} />
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
