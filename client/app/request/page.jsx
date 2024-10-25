"use client";
import WalletInfo from "@/components/WalletInfo";
import React, { useState } from "react";
import { usePlaiaZone } from "../../context/PlaiaZone";
import MetaMaskLoader from "@/components/MetaMaskLoader";

const RequestFundsPage = () => {
  const { account, balance, createCampaign, loading } = usePlaiaZone();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    repaymentAmount: "",
    deadline: "",
    campaignType: "Donation",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const deadlineTime =Math.floor(new Date(formData.deadline).getTime() / 1000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await createCampaign(
        account,
        formData.title,
        formData.description,
        formData.target,
        formData.repaymentAmount,
        deadlineTime,
        formData.campaignType
      );
      if (success) {
        router.push("/");
      } else {
        console.log("ERROR");
      }
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="min-h-screen px-10 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex justify-center items-center py-12  sm:px-6 lg:px-8 relative">
      {/* Wallet Info - Top Right Corner */}
      <MetaMaskLoader loading={loading}/>
      <div className="absolute top-10 right-5">
        <WalletInfo account={account} balance={balance} />
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          Request or Borrow Funds
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block font-semibold mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
                placeholder="Enter campaign title"
                required
              />
            </div>

            {/* Target Amount */}
            <div className="mb-4">
              <label htmlFor="target" className="block font-semibold mb-2">
                Target Amount (in AIA)
              </label>
              <input
                type="number"
                id="target"
                name="target"
                value={formData.target}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
                placeholder="Enter target amount"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
              rows="4"
              placeholder="Describe your campaign"
              required
            />
          </div>

          {/* Repayment Amount & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label
                htmlFor="repaymentAmount"
                className="block font-semibold mb-2"
              >
                Repayment Amount (only for loans)
              </label>
              <input
                type="number"
                id="repaymentAmount"
                name="repaymentAmount"
                value={formData.repaymentAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
                placeholder="Enter repayment amount"
                disabled={formData.campaignType !== "Loan"}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deadline" className="block font-semibold mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Campaign Type */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Campaign Type</label>
            <select
              name="campaignType"
              value={formData.campaignType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
            >
              <option value="Donation">Donation</option>
              <option value="Loan">Loan</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 dark:bg-purple-700 text-white py-4 rounded-lg font-bold hover:bg-purple-700 dark:hover:bg-purple-800 transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestFundsPage;
