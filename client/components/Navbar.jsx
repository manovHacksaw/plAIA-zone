"use client";
import { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import { usePlaiaZone } from "@/context/PlaiaZone";
import MetaMaskLoader from "./MetaMaskLoader";
import WalletInfo from "./WalletInfo";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { loading, account, balance } = usePlaiaZone();

  useEffect(() => {
    // Update the HTML class based on the dark mode state
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <MetaMaskLoader loading={loading} />
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Plaia Zone</div>
        <div className="flex items-center">
          {account ? (
            <WalletInfo account={account} balance={balance} />
          ) : (
            <ConnectWallet loading={loading} />
          )}
        </div>
      </nav>
    </>
  );
}
