// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract GamerCrowdLending {
    enum CampaignType {
        Donation,
        Loan
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target; // Amount being asked
        uint256 repaymentAmount; // Amount to be repaid for loan campaigns
        uint256 deadline;
        uint256 amountCollected;
        CampaignType campaignType;
        address[] backers; // Donators or Lenders
        uint256[] contributions;
        bool isRepaid; // Only for Loan campaigns
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    // Create a new campaign for donation or loan
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _repaymentAmount, // Only for Loan campaigns
        uint256 _deadline,
        CampaignType _campaignType
    ) public returns (uint256) {
        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.repaymentAmount = _campaignType == CampaignType.Loan
            ? _repaymentAmount
            : 0; // Set only for Loan
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        campaign.campaignType = _campaignType;
        campaign.isRepaid = false; // Only relevant for loan campaigns

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    // Back a campaign by donating or lending
    function backCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        require(
            campaign.deadline > block.timestamp,
            "Campaign deadline has passed."
        );
        require(
            campaign.amountCollected < campaign.target,
            "Campaign target already reached."
        );

        campaign.backers.push(msg.sender);
        campaign.contributions.push(amount);

        campaign.amountCollected += amount;
    }

    // Borrower repays a loan
    function repayLoan(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.campaignType == CampaignType.Loan,
            "This is not a loan campaign."
        );
        require(!campaign.isRepaid, "Loan already repaid.");
        require(
            campaign.amountCollected >= campaign.target,
            "Loan target not yet reached."
        );
        require(
            msg.value >= campaign.repaymentAmount,
            "Insufficient repayment amount."
        );

        // Transfer repayment to lenders proportionally
        uint256 totalRepayment = campaign.repaymentAmount;
        uint256 totalCollected = campaign.amountCollected;

        for (uint256 i = 0; i < campaign.backers.length; i++) {
            address lender = campaign.backers[i];
            uint256 contribution = campaign.contributions[i];
            uint256 repaymentShare = (contribution * totalRepayment) / totalCollected;

            (bool sent, ) = payable(lender).call{value: repaymentShare}("");
            require(sent, "Failed to transfer repayment to lender.");
        }

        campaign.isRepaid = true;
    }

    // New: Get total number of campaigns
    function getTotalCampaigns() public view returns (uint256) {
        return numberOfCampaigns;
    }

    // New: Check if a campaign is fully funded
    function isCampaignFullyFunded(uint256 _id) public view returns (bool) {
        Campaign storage campaign = campaigns[_id];
        return campaign.amountCollected >= campaign.target;
    }

    // New: Get the remaining amount to reach the target
    function getRemainingAmount(uint256 _id) public view returns (uint256) {
        Campaign storage campaign = campaigns[_id];
        if (campaign.amountCollected >= campaign.target) {
            return 0;
        }
        return campaign.target - campaign.amountCollected;
    }

   
    function getCampaignById(uint256 _id) public view returns (
        address owner,
        string memory title,
        string memory description,
        uint256 target,
        uint256 repaymentAmount,
        uint256 deadline,
        uint256 amountCollected,
        CampaignType campaignType,
        bool isRepaid
    ) {
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.repaymentAmount,
            campaign.deadline,
            campaign.amountCollected,
            campaign.campaignType,
            campaign.isRepaid
        );
    }

    // Get campaign backers (donators or lenders)
    function getBackers(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].backers, campaigns[_id].contributions);
    }

    // Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
