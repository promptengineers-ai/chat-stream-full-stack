import React from 'react';
import SideDrawer from '../components/drawers/SideDrawer';
import MessageForm from '../components/forms/MessageForm';
import MainNavbar from '../components/navbars/MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <MainNavbar />
      </header>
      
      <main
        style={{ 
          backgroundColor: '#171923', 
          height: '100vh' 
        }}
      >
        <SideDrawer />
        {children}
      </main>
      
      <footer>
        <MessageForm />
      </footer>
    </div>
  );
};

export default Layout;
