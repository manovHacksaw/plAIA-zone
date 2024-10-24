"use client"; 
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from '@/utils/Abi';

// Create the context
const GamerCrowdLendingContext = createContext();

// Define the contract address and ABI
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Replace with your deployed contract address
const contractABI = abi;

// Provider component to wrap around the application
export const GamerCrowdLendingProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Connect to the Ethereum wallet (MetaMask)
  const connectWallet = async () => {
    try {
      if (window.ethereum !== "undefined") {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await ethersProvider.getSigner();
        const accounts = await ethersProvider.send('eth_requestAccounts', []);
  
        setCurrentAccount(accounts[0]);
        const balance = await ethersProvider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
        setProvider(ethersProvider);

        // Initialize the contract with signer
        const crowdLendingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(crowdLendingContract);
      } else {
        alert("MetaMask is not installed. Please install MetaMask to use this DApp.");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Fetch all campaigns from the contract
  const fetchCampaigns = async () => {
    try {
      if (contract) {
        setLoading(true);
        const totalCampaigns = await contract.getTotalCampaigns(); // Fetch total number of campaigns
        const campaignsList = [];

        for (let i = 0; i < totalCampaigns; i++) {
          const campaign = await contract.getCampaignById(i); // Get campaign by ID
          campaignsList.push(campaign);
        }

        // Sort campaigns with the latest ones on top
        setCampaigns(campaignsList.reverse());
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  const fetchCampaignById = async (id) => {
    if (contract) {
      try {
        const campaignData = await contract.getCampaignById(id);
        const formattedCampaign = {
          title: campaignData[1],
          description: campaignData[2],
          target: campaignData[3].toString(),
          amountCollected: campaignData[6].toString(),
          deadline: campaignData[5],
          isRepaid: campaignData[8],
          campaignType: campaignData[7], // 0: Donation, 1: Loan
        };
        return formattedCampaign;
      } catch (error) {
        console.error("Error fetching campaign by ID:", error);
      }
    }
    return null;
  };
  

  // Create a new campaign (donation or loan)
  const createCampaign = async (title, description, target, repaymentAmount, deadline, campaignType) => {
    try {
      if (contract) {
        setLoading(true);
        const tx = await contract.createCampaign(
          currentAccount,
          title,
          description,
          target,
          repaymentAmount,
          deadline,
          campaignType
        );
        await tx.wait();
        fetchCampaigns(); // Refresh campaigns after creating
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      setLoading(false);
    }
  };

  // Back a campaign (donate or lend)
  const backCampaign = async (campaignId, amount) => {
    try {
      if (contract) {
        setLoading(true);
        const tx = await contract.backCampaign(campaignId, {
          value: ethers.parseEther(amount) // Convert amount to wei
        });
        await tx.wait();
        fetchCampaigns(); // Refresh campaigns after backing
        setLoading(false);
      }
    } catch (error) {
      console.error("Error backing campaign:", error);
      setLoading(false);
    }
  };

  // Repay a loan for a specific campaign
  const repayLoan = async (campaignId, repaymentAmount) => {
    try {
      if (contract) {
        setLoading(true);
        const tx = await contract.repayLoan(campaignId, {
          value: ethers.parseEther(repaymentAmount) // Convert amount to wei
        });
        await tx.wait();
        fetchCampaigns(); // Refresh campaigns after repayment
        setLoading(false);
      }
    } catch (error) {
      console.error("Error repaying loan:", error);
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setCurrentAccount(null);
    setContract(null);
    setBalance(0);
  };

  useEffect(() => {
    connectWallet(); // Auto-connect wallet on load
    fetchCampaigns();
  }, []);

  return (
    <GamerCrowdLendingContext.Provider
      value={{
        currentAccount,
        campaigns,
        balance,
        createCampaign,
        backCampaign,
        repayLoan,
        connectWallet,
        disconnectWallet,
        fetchCampaigns,
        fetchCampaignById,
        loading
      }}
    >
      {children}
    </GamerCrowdLendingContext.Provider>
  );
};

// Custom hook to use the context
export const useGamerCrowdLending = () => {
  return useContext(GamerCrowdLendingContext);
};
