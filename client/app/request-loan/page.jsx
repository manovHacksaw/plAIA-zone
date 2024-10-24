"use client"; // Required for client-side components
import React, { useState } from "react";
import { useGamerCrowdLending } from "@/context/CrowdLending"; // Import your context
import { ethers } from "ethers";

const RequestLoan = () => {
  const { createCampaign } = useGamerCrowdLending(); // Destructure the createCampaign function from your context

  // State variables for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert target and repayment amounts to Wei
    const target = ethers.parseEther(targetAmount);
    const repayment = ethers.parseEther(repaymentAmount);
    const deadlineTimestamp = new Date(deadline).getTime() / 1000; // Convert to Unix timestamp

    try {
      await createCampaign(title, description, target, repayment, deadlineTimestamp, 1);
      // Optionally, reset form after submission
      setTitle("");
      setDescription("");
      setTargetAmount("");
      setRepaymentAmount("");
      setDeadline("");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div className="flex flex-col items-center text-white p-8 bg-gray-800 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Request a Loan</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-accentPink"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-accentPink"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="target">Target Amount (AIA)</label>
          <input
            type="number"
            id="target"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-accentPink"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="repayment">Repayment Amount (AIA)</label>
          <input
            type="number"
            id="repayment"
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-accentPink"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="deadline">Deadline</label>
          <input
            type="datetime-local"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-accentPink"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accentPink text-white py-2 rounded-lg hover:bg-pink-700 transition duration-300"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default RequestLoan;
