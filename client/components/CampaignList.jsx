import React from 'react';
import CampaignCard from './CampaignCard';

const CampaignList = ({ campaigns }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((campaign, index) => (
            <CampaignCard
              key={index}
              owner={campaign.owner}
              title={campaign.title}
              description={campaign.description}
              target={campaign.target}
              repaymentAmount={campaign.repaymentAmount}
              deadline={campaign.deadline}
              campaignType={campaign.campaignType}
              handleClick={() => console.log(`Viewing campaign: ${campaign.title}`)} // Replace with navigation or view logic
            />
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">No campaigns found.</p>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
