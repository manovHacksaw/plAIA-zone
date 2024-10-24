import React from 'react';
import Image from 'next/image';
import WalletInfo from './WalletInfo';

const Navbar = () => {
  return (
    <nav className=" text-white p-4 flex items-center justify-between ">
      {/* App Name */}
      <div className="text-2xl font-extrabold tracking-tight">
        Plaia Zone
      </div>
      
      {/* Wallet Info */}
      <div className="flex items-center space-x-4 mx-2">
        <WalletInfo />
        {/* AIA Chain Logo (optional additional logo or branding) */}
        
      </div>
    </nav>
  );
};

export default Navbar;
