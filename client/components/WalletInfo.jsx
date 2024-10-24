"use client"; // Required for client-side components
import React from "react";
import Image from "next/image";
import { useGamerCrowdLending } from "@/context/CrowdLending"; // Import your context

const WalletInfo = () => {
  const {
    currentAccount,
    balance,
    connectWallet,
  } = useGamerCrowdLending(); // Destructure the values and functions from the context

  // Function to trim wallet address for better UX
  const trimAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Connect Wallet Button */}
      {!currentAccount && (
        <button
          className="mb-4 bg-accentPink px-4 py-2 rounded-lg text-white font-bold"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {/* Wallet Info Display */}
      {currentAccount && (
        <div className="flex opacity-75 items-center space-x-4 bg-primaryBlue text-white p-4 rounded-lg">
          {/* MetaMask Logo */}
          <Image
            src={"/meta_mask_logo.svg"}
            alt="MetaMask"
            width={40}
            height={40}
            className="rounded-full"
          />

          {/* Display Wallet Address */}
          <div className="flex flex-col text-center">
            <span className="font-semibold">
              {trimAddress(currentAccount)}
            </span>
            <span className="text-sm text-gray-300">Balance: {balance} AIA</span>
          </div>

          {/* AIA Logo */}
          <Image
            src={"/aia_logo.png"}
            alt="AIA Chain"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
