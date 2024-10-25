"use client";

import { ethers } from "ethers";
import { createContext, useState, useEffect, useContext, useMemo } from "react";
import abi from "@/utils/Abi";
const PlaiaZoneContext = createContext();

export const PlaiaZoneProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0.000");
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const contractABI = abi;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const loadContract = async (signer = null) => {
    const providerInstance = new ethers.BrowserProvider(
      window.ethereum ||
        new ethers.JsonRpcProvider(
          "https://aia-dataseed1-testnet.aiachain.org/"
        )
    );
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer ? signer : providerInstance
    );
    setContract(contractInstance);
    return contractInstance;
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        setProvider(providerInstance);

        const aiaTestnetChainId = "0x528"; // Hexadecimal for 1320
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Switch to the correct network
        if (chainId !== aiaTestnetChainId) {
          await switchNetwork(aiaTestnetChainId);
        }

        const accounts = await providerInstance.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const balance = await providerInstance.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
        setIsConnected(true);
        setLoading(false);

        await loadContract();
      } catch (error) {
        console.error("Error connecting to wallet: ", error);
      }
    } else {
      alert("MetaMask is required to use this app.");
      window.open("https://metamask.io/download.html", "_blank");
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await addNetwork(chainId);
      } else {
        console.error("Error switching networks:", switchError);
      }
    }
  };

  const addNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: "AIA Testnet",
            rpcUrls: ["https://aia-dataseed1-testnet.aiachain.org/"],
            nativeCurrency: {
              name: "AIA Testnet",
              symbol: "AIA",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.aiascan.com/"],
          },
        ],
      });
    } catch (addError) {
      console.error("Error adding network:", addError);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance("0.000");
    loadContract();
  };

  const createCampaign = async (
    owner,
    title,
    description,
    target,
    repaymentAmount,
    deadline,
    campaignType
  ) => {
    const signer = await provider.getSigner();
    const contract = await loadContract(signer);

    if (!contract) {
      console.error("Provider is not set. Please connect your wallet.");
      return false;
    }

    try {
      setLoading(true);

      // Assuming the contract method is called `createCampaign` and it takes the specified parameters
      const transaction = await contract.createCampaign(
        owner, // Owner address (wallet address of the campaign creator)
        title, // Title of the campaign
        description, // Description of the campaign
        ethers.parseEther(target), // Convert target amount to ethers (assuming AIA uses the same decimals as ETH)
        campaignType === "Loan" ? ethers.parseEther(repaymentAmount) : 0, // Repayment amount only for loan campaigns, otherwise 0
        deadline, // Deadline as a timestamp (convert to the correct format if necessary)
        campaignType === "Loan" ? 1 : 0 // Assuming 1 for Loan, 0 for Donation
      );

      // Wait for the transaction to be confirmed
      await transaction.wait();

      console.log("Campaign created successfully:", transaction);

      // Refresh campaigns or handle any post-creation tasks
      await getCampaigns(); // Assuming this is a function to fetch all campaigns

      return true; // Return true if the campaign creation is successful
    } catch (error) {
      console.error("Error creating campaign:", error);
      return false; // Return false if an error occurs
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const getCampaigns = async () => {
    setLoading(true);
    try {
      const contract = await loadContract();
      const n = await contract.getTotalCampaigns();
      const campaignsArray = [];

      for (let i = 0; i < n; i++) {
        const campaign = await contract.getCampaignById(i); // Fetch event details
        campaignsArray.push(campaign); // Add event details to the array
      }

      setCampaigns(campaignsArray);
      console.log(campaigns);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getCampaignById = async (id) => {
    setLoading(true); // Set loading to true at the start
    try {
      const contract = await loadContract(); // Load the contract instance
      const campaign = await contract.getCampaignById(id); // Fetch campaign details

      // Parse the campaign data into an easy-to-use format
      const parsedCampaign = {
        id, // Campaign ID
        owner: campaign[0], // Address of the campaign owner
        title: campaign[1], // Campaign title
        description: campaign[2], // Campaign description
        target: ethers.formatUnits(campaign[3], "ether").toString(), // Target amount in ether
        repaymentAmount: ethers.formatUnits(campaign[4], "ether").toString(), // Repayment amount in ether
        deadline: new Date(Number(campaign[5]) * 1000).toLocaleDateString(), // Convert UNIX timestamp to readable date
        campaignType: campaign[7] === 1n ? "Loan" : "Donation", // Type: Loan or Donation
      };

      setLoading(false);
      return parsedCampaign;
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setLoading(false); // Stop loading if there's an error
      throw error; // Re-throw the error for potential handling by calling function
    }
  };

  const fundCampaign = async (id, amount) => {
    setLoading(true);
    try {
      
      const signer = await provider.getSigner();
      const contract = await loadContract(signer); // Load the contract instance

      // Call the backCampaign function on the smart contract
      const transaction = await contract.backCampaign(id, {
        value: amount, // Amount being contributed (in Wei)
      });

      // Wait for the transaction to be confirmed
      await transaction.wait();

      // Optionally, update local state or perform any action after funding
      alert("Successfully funded the campaign!");

      // Reload the campaign data or update the UI as necessary
      // You might want to call fetchCampaign again here or update your state
    } catch (error) {
      console.error("Error funding campaign:", error);
      alert("Failed to fund the campaign. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  const getRemainingAmount = async (id) => {
    try {
      const contract = await loadContract();
      const remainingAmount = await contract.getRemainingAmount(id);
      return ethers.formatUnits(remainingAmount, "ether").toString();
    } catch (error) {
      console.error("Error getting remaining amount:", error);
    }
  };

  const getBackersByCampaignId = async (campaignId) => {
    try {
      const contract = await loadContract();
      const [backers, contributions] = await contract.getBackers(campaignId);
  
      // Map the data into a structured format for easier frontend use
      return backers.map((backer, index) => ({
        address: backer,
        amount: ethers.formatUnits(contributions[index], "ether").toString(), // format contribution in ether
      }));
    } catch (error) {
      console.error("Failed to fetch backers:", error);
      return [];
    }
  };

  const repayLoan = async (campaignId, amount) => {
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = await loadContract(signer);
      const transaction = await contract.repayLoan(campaignId, {
        value: ethers.parseUnits(amount, "ether"), // Ensure amount is in ether format
      });
      await transaction.wait(); // Wait for the transaction to be mined
      console.log("Loan repayment successful:", transaction);
      return  true ;
    } catch (error) {
      console.error("Failed to repay loan:", error);
      return false;
    } finally{
      setLoading(false);
    }
  };
  

  const isCampaignFullyFunded = async (id) => {
    try {
      const contract = await loadContract();
      return await contract.isCampaignFullyFunded(id);
    } catch (error) {
      console.error("Error checking if campaign is fully funded:", error);
    }
  };

  const withdrawFunds = async (id) => {
    try {
      const signer = await provider.getSigner();
      const contract = await loadContract(signer);

      const transaction = await contract.withdrawFunds(id);
      await transaction.wait();

      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. Please try again.");
    }
  };

  useEffect(() => {
    loadContract(); // Load contract on initial render
    getCampaigns();
  }, []);

  useEffect(() => {
    // If the user has already connected their wallet, automatically reconnect and fetch campaigns
    if (account) {
      loadContract();
    }
  }, [account]);

  return (
    <PlaiaZoneContext.Provider
      value={{
        account,
        balance,
        isConnected,
        loading,
        campaigns,
        connectWallet,
        disconnectWallet,
        createCampaign,
        getCampaignById,
        fundCampaign,
        getRemainingAmount,
        isCampaignFullyFunded,
        withdrawFunds,
        repayLoan,
        getBackersByCampaignId
      }}
    >
      {children}
    </PlaiaZoneContext.Provider>
  );
};

export const usePlaiaZone = () => useContext(PlaiaZoneContext);
