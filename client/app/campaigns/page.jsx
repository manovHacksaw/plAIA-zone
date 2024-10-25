"use client";
import { useState } from "react";
import { ethers } from "ethers";
import WalletInfo from "@/components/WalletInfo";
import { usePlaiaZone } from "@/context/PlaiaZone";
import CampaignCard from "@/components/CampaignCard";
import ConnectWallet from "@/components/ConnectWallet";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CampaignListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { campaigns, account, connectWallet, balance, loading } =
    usePlaiaZone();
  const router = useRouter();

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  const parseCampaignData = (campaign, index) => {
    return {
      index,
      owner: campaign[0],
      title: campaign[1],
      description: campaign[2],
      target: ethers.formatUnits(campaign[3]).toString(),
      repaymentAmount: ethers.formatUnits(campaign[4]).toString(),
      deadline: new Date(Number(campaign[5]) * 1000).toLocaleDateString(),
      campaignType: campaign[7] === 1n ? "Loan" : "Donation",
    };
  };

  const parsedCampaigns = campaigns.map(parseCampaignData).reverse();

  const filteredCampaigns = parsedCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="min-h-screen">
      <div className="py-10 px-6">
        {/* Top section with Search bar and Wallet Info */}
        <div className="flex justify-between items-center mb-8 w-full">
          {/* Left: Plaia Zone header */}
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            Plaia Zone
          </div>

          {/* Right: Search bar, Wallet Info / Connect Wallet, and Campaign button */}
          <div className="flex items-center gap-4 w-full max-w-2xl justify-end">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search campaigns by title..."
              className="w-1/2 max-w-xs sm:max-w-sm px-4 py-4 rounded-lg bg-white text-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-4 focus:ring-purple-500 focus:outline-none transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
              value={searchTerm}
              onChange={handleSearch}
            />

            {/* Wallet Info or Connect Wallet */}
            {account ? (
              <button
                onClick={() => {
                  router.push("/request");
                }}
                className="px-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition duration-200 ease-in-out"
              >
                Create Your Own Campaign
              </button>
            ) : (
              <ConnectWallet loading={false} />
            )}
          </div>
        </div>

        <div className="px-2 py-10 flex flex-wrap  items-center gap-4">
          {loading ? (
            <div className="flex justify-center w-full">
              <Image
                src="/headerGIF.gif"
                className="dark:invert"
                width={300}
                height={300}
                alt="Loading..."
              />
            </div>
          ) : filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.index} {...campaign} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 w-full">
              No campaigns found.
            </p>
          )}
        </div>

        {/* Campaign List */}
      </div>
    </div>
  );
};

export default CampaignListPage;
