import React from 'react';
import SideDrawer from '../components/drawers/SideDrawer';
import MessageForm from '../components/forms/MessageForm';
import MainNavbar from '../components/navbars/MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <body 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#171923', 
        height: '100vh' 
      }}
    >
      <header>
        <MainNavbar />
      </header>
      
      <main style={{ flex: 1, display: 'flex' }}>
        <SideDrawer />
        {children}
      </main>
      
      <footer>
        <MessageForm />
      </footer>
    </body>
  );
};

export default Layout;
