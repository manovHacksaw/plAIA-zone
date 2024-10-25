"use client";
import { usePlaiaZone } from "@/context/PlaiaZone";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { isConnected, connectWallet } = usePlaiaZone();
  
  const handleRequestClick = async () => {
    if (isConnected) {
      router.push("/request");
    }
    if (!isConnected) {
      // If the wallet is not connected, prompt the user to connect it
      await connectWallet();
    
      router.push("/request");
    }
  };

  return (
    <header className="text-center flex flex-col items-center justify-center my-12 px-4">
      <h1 className="text-5xl font-bold mb-6">
        Help your fellow <span className="text-blue-500">Gamers</span> and Earn
      </h1>

      <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
        Empowering Gamers, Connecting Worlds – Fund, Play, Thrive on AIA
      </p>

      {/* Invert filter applied to the image */}
      <Image 
        src="/headerGIF.gif" 
        width={200} 
        height={200} 
        alt="Inverted Header Image" 
         className="dark:invert"
      
      />

      <div className="flex justify-center p-10 space-x-4">
        <button 
          onClick={() => { router.push("campaigns"); }}
          className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-purple-700"
        >
          Fund Your Fellows
        </button>
        <button
          onClick={handleRequestClick}
          className="px-8 py-4 bg-pink-600 dark:bg-pink-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-pink-700"
        >
          Request/Borrow Funds
        </button>
      </div>
    </header>
  );
}
