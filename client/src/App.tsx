import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components here
import Home from './pages/Home';
import Vectorstore from './pages/Vectorstore';
import MainLayout from './layouts/MainLayout';

import SourcesProvider from './contexts/SourcesContext';

function App() {
  return (
    <SourcesProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vectorstore" element={<Vectorstore />} />
            {/* You can add more Route components here for your different pages */}
          </Routes>
        </MainLayout>
      </Router>
    </SourcesProvider>
  );
}

export default App;
