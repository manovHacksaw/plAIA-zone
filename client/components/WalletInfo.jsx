import Image from 'next/image';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const WalletInfo = ({ account, balance }) => {
  const { darkMode } = useTheme();

  const formatAddress = (address) => `${address.slice(0, 12)}...${address.slice(-4)}`;
  const formatBalance = (balance) => parseFloat(balance).toFixed(5);

  return (
    <div
      className={`flex items-center justify-between px-5 py-3 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      <Image src="/aia_avatar.png" alt="Avatar" width={30} height={30} className="rounded-full mr-3" />
      <div className="ml-2">
        <p className="font-semibold text-md">{formatAddress(account)}</p>
        <p className={`text-sm text-center font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatBalance(balance)} AIA
        </p>
      </div>
    </div>
  );
};

export default WalletInfo;
