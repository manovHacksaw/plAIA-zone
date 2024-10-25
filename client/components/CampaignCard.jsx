import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CampaignCard = ({ index, owner, title, description, target, repaymentAmount, deadline, campaignType, handleClick }) => {
  return (
    <Link href={`/back-campaign/${index}`}>
      <div
        className="sm:w-[320px] w-full rounded-lg bg-white dark:bg-[#2a2b36] hover:bg-gray-100 dark:hover:bg-[#34353f] cursor-pointer transition-all duration-200 ease-in-out shadow-lg"
        onClick={handleClick}
      >
        <div className="flex flex-col p-6">
          {/* Title and Description */}
          <div className="block mb-4">
            <h3 className="font-bold text-[18px] text-black dark:text-white leading-[28px] truncate">{title}</h3>
          </div>

          {/* Campaign Stats */}
          <div className="flex justify-between flex-wrap mt-4 gap-4">
            {/* Target Amount */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[16px] text-gray-800 dark:text-[#e6e6ea] leading-[24px]">{target} AIA</h4>
              <p className="mt-2 text-[14px] leading-[20px] text-gray-600 dark:text-[#a1a2ad]">Target Amount</p>
            </div>

            {/* Repayment Amount (only for Loans) */}
            {campaignType === 'Loan' && (
              <div className="flex flex-col">
                <h4 className="font-semibold text-[16px] text-gray-800 dark:text-[#e6e6ea] leading-[24px]">{repaymentAmount} AIA</h4>
                <p className="mt-2 text-[14px] leading-[20px] text-gray-600 dark:text-[#a1a2ad]">Repayment Amount</p>
              </div>
            )}

            {/* Deadline */}
            <div className="flex flex-col">
              <h4 className="font-semibold text-[16px] text-gray-800 dark:text-[#e6e6ea] leading-[24px]">{deadline}</h4>
              <p className="mt-2 text-[14px] leading-[20px] text-gray-600 dark:text-[#a1a2ad]">Deadline</p>
            </div>
          </div>

          {/* Footer: Avatar, Owner, and Campaign Type */}
          <div className="flex items-center mt-6 gap-4">
            <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-gray-100 dark:bg-[#1e1e29]">
              <Image
                src="/aia_avatar.png" // Default avatar image
                alt="user"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="flex-1 text-[14px] text-gray-600 dark:text-[#a1a2ad] truncate">
              by <span className="text-gray-800 dark:text-[#d2d3e0]">{owner}</span>
            </p>
            <p className="font-bold text-[14px] text-gray-800 dark:text-[#d2d3e0]">{campaignType}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
