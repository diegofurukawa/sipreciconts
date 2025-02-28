// src/layouts/MainLayout/components/Header.tsx
import React from 'react';
import { Navbar } from './Navbar';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <Navbar />
    </header>
  );
};

export default Header;