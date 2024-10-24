"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const Header = () => {
    const router = useRouter();
  return (
    <div className="relative flex flex-col items-center text-center space-y-4 py-8 text-white">
      {/* Floating Images */}
      <Image
        src="/game.png"
        height={100}
        width={100}
        alt="Gaming Image"
        className="absolute top-10 left-10 animate-float"
      />
      <Image
        src="/man-wearing-vr-glasses-gaming.png"
        height={100}
        width={100}
        alt="VR Gaming Image"
        className="absolute top-20 right-16 animate-float delay-200"
      />
      <Image
        src="/money.png"
        height={100}
        width={100}
        alt="Money Image"
        className="absolute top-28 left-32 animate-float delay-400"
      />
      
      {/* Main Header Image */}
      <Image
        src="/header.webp"
        height={200}
        width={200}
        alt="Main Header Image"
        className="relative"
      />

      {/* Tagline */}
      <h1 className="text-2xl font-bold">
        Fueling Gamers with Blockchain Power – Play, Fund, Succeed
      </h1>

      {/* Buttons */}
      <div className="space-x-4 mt-4">
        <button onClick={()=>{router.push("/request-donation")}} className="bg-primaryBlue text-white py-2 px-6 rounded-md shadow-lg hover:bg-blue-800 transition duration-300">
          Need Funds?
        </button>
        <button onClick={()=>{router.push("/campaigns")}} className="bg-accentPink text-white py-2 px-6 rounded-md shadow-lg hover:bg-pink-700 transition duration-300">
          Fund Your Fellow Gamers
        </button>
      </div>
    </div>
  );
};

export default Header;
