"use client"; // Required for client-side components
import React, { useEffect, useState } from "react";
import { useGamerCrowdLending } from "@/context/CrowdLending"; // Import your context
import { ethers } from "ethers";
import { useRouter } from "next/navigation"; // For programmatic navigation

const Campaigns = () => {
  const { fetchCampaigns, campaigns } = useGamerCrowdLending(); // Destructure the function to get campaigns
  const [loading, setLoading] = useState(true); // To manage loading state
  const router = useRouter(); // Initialize useRouter for navigation

  // Fetch campaigns on component mount
  const getCampaigns = async () => {
    try {
      setLoading(true);
      await fetchCampaigns(); // Fetch the campaigns from the contract
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false); // Stop loading once the campaigns are fetched
    }
  };

  useEffect(() => {
    getCampaigns(); // Run the function when component mounts
  }, []);

  // Handle card click to navigate to the campaign detail page
  const handleCardClick = (id) => {
    router.push(`/campaign/${id}`); // Navigate to campaign/[id]
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">All Campaigns</h1>

      {/* Display loading message while fetching campaigns */}
      {loading && <p>Loading campaigns...</p>}

      {/* Display campaigns in a grid if available */}
      {!loading && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)} // Navigate to campaign page on click
              className="cursor-pointer bg-primaryBlue p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold">{campaign.title}</h2>
              <p className="mt-2">{campaign.description}</p>

              {/* Convert BigInt to string for safe display */}
              <p className="mt-4">Target: {ethers.formatEther(campaign.target.toString())} AIA</p>
              <p className="mt-2">Collected: {ethers.formatEther(campaign.amountCollected.toString())} AIA</p>

              {/* Convert deadline (timestamp) to a proper date */}
              <p className="mt-2">
                Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleString()}
              </p>

              <p className="mt-2">
                {campaign.isRepaid ? "Status: Repaid" : "Status: Active"}
              </p>

              <p className="mt-2">
                Campaign Type: {campaign.campaignType === 1 ? "Loan" : "Donation"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No campaigns available.</p>
      )}
    </div>
  );
};

export default Campaigns;
