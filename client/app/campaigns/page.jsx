"use client";
import { useState } from "react";
import { ethers } from "ethers";
import WalletInfo from "@/components/WalletInfo";
import { usePlaiaZone } from "@/context/PlaiaZone";
import CampaignCard from "@/components/CampaignCard";
import Navbar from "@/components/Navbar"; // Import Navbar

const CampaignListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { campaigns } = usePlaiaZone();  // Fetch campaigns from PlaiaZone context

  // Convert campaign object to more readable form for CampaignCard component
  const parseCampaignData = (campaign, index) => {
    return {
      index, // Add index for unique navigation
      owner: campaign[0], // Address of the campaign owner
      title: campaign[1], // Campaign title
      description: campaign[2], // Campaign description
      target: ethers.formatUnits(campaign[3]).toString(), // Target amount in wei (needs to be converted for display)
      repaymentAmount: ethers.formatUnits(campaign[4]).toString(), // Repayment amount in wei (if it's a loan)
      deadline: new Date(Number(campaign[5]) * 1000).toLocaleDateString(), // Convert UNIX timestamp to date
      campaignType: campaign[7] === 1n ? "Loan" : "Donation", // Check type: 1 for Loan, otherwise Donation
    };
  };

  // Convert and sort campaigns by deadline (latest first)
  const parsedCampaigns = campaigns
    .map(parseCampaignData)
    .sort((a, b) => new Date(b.deadline) - new Date(a.deadline)); // Sort by deadline, newest first

  // Filter campaigns by search term
  const filteredCampaigns = parsedCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="min-h-screen">
      {/* Navbar Component */}
      <Navbar />

      <div className="py-10 px-6">
        {/* Search Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search campaigns by title..."
            className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Campaigns List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.index}  {...campaign} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
              No campaigns found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignListPage;
