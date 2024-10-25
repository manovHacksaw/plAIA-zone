"use client";
import FundCampaignDialog from "@/components/FundCampaignDialog";
import { usePlaiaZone } from "@/context/PlaiaZone";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const BackCampaignPage = ({ params }) => {
  const {
    getCampaignById,
    getRemainingAmount,
    isCampaignFullyFunded,
    withdrawFunds,
    account,
    getBackersByCampaignId,
    repayLoan
  } = usePlaiaZone();
  const [campaign, setCampaign] = useState(null);
  const [fundedAmount, setFundedAmount] = useState("0.000");
  const [isFullyFunded, setIsFullyFunded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backers, setBackers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const campaignData = await getCampaignById(params.id);
        setCampaign(campaignData);

        const backersList = await getBackersByCampaignId(params.id); // Fetch backers
        setBackers(backersList); // Store backers in state

        // Fetch funded amount and check if the campaign is fully funded
        const remaining = await getRemainingAmount(params.id);
        const target = campaignData.target; // Convert target to ether for calculation
        console.log(remaining);
        console.log(target);
        setFundedAmount((target - remaining).toString());

        const fullyFunded = await isCampaignFullyFunded(params.id);
        setIsFullyFunded(fullyFunded);
      } catch (err) {
        console.error("Failed to fetch campaign:", err);
        setError("Could not load campaign details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [params.id]);

  const handleWithdraw = async () => {
    try {
      await withdrawFunds(params.id);
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Failed to withdraw funds.");
    }
  };

  const handleRepayLoan = async () => {
    try {
      await repayLoan(params.id, campaign.repaymentAmount);
      alert("Loan repaid successfully!");
    } catch (error) {
      console.error("Repayment failed:", error);
      alert("Failed to repay loan.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-lg font-semibold dark:text-gray-200">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 font-semibold dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
          {campaign.title}
        </h1>

        <div className="text-gray-700 dark:text-gray-300 mb-6">
          <p>
            <strong>Description:</strong> {campaign.description}
          </p>
          <p className="mt-2">
            <strong>Target Amount:</strong> {campaign.target} AIA
          </p>
          <p className="mt-2">
            <strong>Funded Amount:</strong> {fundedAmount} AIA
          </p>
          {campaign.campaignType === "Loan" && (
            <p className="mt-2">
              <strong>Repayment Amount:</strong> {campaign.repaymentAmount} AIA
            </p>
          )}
          <p className="mt-2">
            <strong>Deadline:</strong> {campaign.deadline}
          </p>
          <p className="mt-2">
            <strong>Type:</strong> {campaign.campaignType}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Backers
          </h2>
          {backers.length > 0 ? (
            <ul>
              {backers.map((backer, index) => (
                <li
                  key={index}
                  className="flex justify-between text-gray-600 dark:text-gray-300 mb-2"
                >
                  <span>{backer.address}</span>
                  <span>{backer.amount} AIA</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No backers yet.</p>
          )}
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-700 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-200 p-4 mb-6 rounded-md">
          <p className="font-semibold">Terms and Conditions</p>
          <p className="text-sm mt-2">
            Plaia Zone is primarily intended for donations to support gamers.
            While some campaigns may involve loans where repayment is expected,
            Plaia Zone is not responsible for ensuring that these repayments are
            made. Supporters should carefully consider the campaign details and
            make decisions at their own risk.
          </p>
        </div>

        {account?.toLowerCase() !== campaign.owner.toLowerCase() ? (
          <FundCampaignDialog title={campaign.title} campaignId={campaign.id} />
        ) : (
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 italic mb-4">
              You are the owner of this campaign.
            </p>
            {isFullyFunded ? (
              <button
                onClick={handleWithdraw}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition mb-4"
              >
                Withdraw Funds
              </button>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-300 font-semibold mb-4">
                Campaign is not fully funded yet.
              </p>
            )}
            
            {campaign.campaignType === "Loan" &&
              (isFullyFunded ||
                Date.now() > new Date(campaign.deadline).getTime()) && (
                <button
                  onClick={handleRepayLoan}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Repay Loan
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackCampaignPage;
