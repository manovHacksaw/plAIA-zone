"use client"; // Required for client-side components
import React, { useState, useEffect } from "react";
import { useGamerCrowdLending } from "@/context/CrowdLending"; // Custom hook to interact with contract
import { useParams } from "next/navigation"; // Use `useParams` to handle dynamic params

const CampaignPage = () => {
  const { backCampaign, contract, connectWallet, currentAccount, fetchCampaignById } = useGamerCrowdLending();
  const [campaign, setCampaign] = useState(null); // To store campaign details
  const [amount, setAmount] = useState(""); // To store the inputted contribution amount
  const [loading, setLoading] = useState(false); // Loading state for transaction processing
  const params = useParams(); // Get dynamic params from the URL
  const { id } = params; // Destructure the campaign ID

  // Function to fetch campaign details by ID
  const getCampaign = async (id) => {
    const fetchedCampaign = await fetchCampaignById(id); // Fetch campaign details by ID
    if (fetchedCampaign) {
      setCampaign(fetchedCampaign); // Set the campaign state once it's fetched
    }
  };

  // Handle contribution submission
  const handleContribute = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await backCampaign(id, amount); // Call backCampaign function to contribute
      alert("Transaction successful!");
      setAmount(""); // Clear the input after successful contribution
      getCampaign(id); // Refresh the campaign details after the contribution
    } catch (error) {
      console.error("Error making a contribution:", error);
      alert("Failed to make a contribution");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch campaign details on contract load
  useEffect(() => {
    if (contract) {
      getCampaign(id); // Fetch campaign details once the contract is loaded
    }
  }, [contract, id]); // Dependency array ensures the effect runs when the contract or id changes

  return (
    <div className="p-6 text-white">
      {/* Display wallet connect button or show connected account */}
      {currentAccount ? (
        <p>Connected Account: {currentAccount}</p>
      ) : (
        <button onClick={connectWallet} className="bg-blue-500 px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}

      
        <div>
          {/* Display campaign details */}
          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
          <p>{campaign.description}</p>
          <p className="mt-4">Target: {campaign.target} AIA</p>
          <p className="mt-2">Collected: {campaign.amountCollected} AIA</p>
          <p className="mt-2">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
          <p className="mt-2">Status: {campaign.isRepaid ? "Repaid" : "Active"}</p>
          <p className="mt-2">Campaign Type: {campaign.campaignType === 1 ? "Loan" : "Donation"}</p>

          {/* Contribution Form */}
          <form onSubmit={handleContribute} className="mt-6">
            <label htmlFor="amount" className="block mb-2">
              Enter Amount to Contribute (in AIA):
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-4 py-2 bg-primaryBlue rounded-lg text-white w-full"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-accentPink px-6 py-2 rounded-lg text-white font-bold"
              disabled={loading}
            >
              {loading ? "Processing..." : "Contribute"}
            </button>
          </form>
        </div>
      
    </div>
  );
};

export default CampaignPage;
