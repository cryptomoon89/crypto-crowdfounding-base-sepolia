// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FundToken.sol";

contract CrowdfundingCampaign is ReentrancyGuard, Ownable {
    FundToken public fundToken;
    
    // Treasury wallet that receives all fees
    address public constant TREASURY = 0x1234567890123456789012345678901234567890;
    
    uint256 public campaignCounter;
    uint256 public platformFeePercent = 250; // 2.5%
    bool public maintenanceMode = false;
    
    struct Campaign {
        uint256 id;
        string title;
        string description;
        address owner;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool goalReached;
        bool fundsWithdrawn;
        bool active;
        uint256 createdAt;
    }
    
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Contribution[]) public campaignContributions;
    mapping(uint256 => mapping(address => uint256)) public userContributions;
    mapping(address => uint256[]) public userCampaigns;
    mapping(address => uint256) public totalContributed;
    mapping(address => uint256) public totalRaised;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title, uint256 goal, uint256 deadline);
    event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event GoalReached(uint256 indexed campaignId, uint256 totalRaised);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event RefundClaimed(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event MaintenanceModeToggled(bool enabled);
    
    modifier notInMaintenance() {
        require(!maintenanceMode, "Contract is in maintenance mode");
        _;
    }
    
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignCounter, "Campaign does not exist");
        _;
    }
    
    constructor(address _fundTokenAddress) {
        fundToken = FundToken(_fundTokenAddress);
    }
    
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external notInMaintenance {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        
        campaigns[campaignCounter] = Campaign({
            id: campaignCounter,
            title: _title,
            description: _description,
            owner: msg.sender,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            goalReached: false,
            fundsWithdrawn: false,
            active: true,
            createdAt: block.timestamp
        });
        
        userCampaigns[msg.sender].push(campaignCounter);
        
        emit CampaignCreated(campaignCounter, msg.sender, _title, _goal, deadline);
        campaignCounter++;
    }
    
    function contribute(uint256 _campaignId) external payable nonReentrant notInMaintenance campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than 0");
        require(!campaign.goalReached, "Campaign goal already reached");
        
        campaign.amountRaised += msg.value;
        userContributions[_campaignId][msg.sender] += msg.value;
        totalContributed[msg.sender] += msg.value;
        
        campaignContributions[_campaignId].push(Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        emit ContributionMade(_campaignId, msg.sender, msg.value);
        
        if (campaign.amountRaised >= campaign.goal) {
            campaign.goalReached = true;
            emit GoalReached(_campaignId, campaign.amountRaised);
        }
    }
    
    function withdrawFunds(uint256 _campaignId) external nonReentrant campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Only campaign owner can withdraw");
        require(campaign.goalReached, "Campaign goal not reached");
        require(!campaign.fundsWithdrawn, "Funds already withdrawn");
        require(campaign.amountRaised > 0, "No funds to withdraw");
        
        campaign.fundsWithdrawn = true;
        totalRaised[campaign.owner] += campaign.amountRaised;
        
        uint256 platformFee = (campaign.amountRaised * platformFeePercent) / 10000;
        uint256 ownerAmount = campaign.amountRaised - platformFee;
        
        // Send platform fee to treasury
        (bool feeSuccess, ) = TREASURY.call{value: platformFee}("");
        require(feeSuccess, "Platform fee transfer failed");
        
        // Send remaining funds to campaign owner
        (bool success, ) = campaign.owner.call{value: ownerAmount}("");
        require(success, "Fund transfer failed");
        
        emit FundsWithdrawn(_campaignId, campaign.owner, ownerAmount);
    }
    
    function claimRefund(uint256 _campaignId) external nonReentrant campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.deadline, "Campaign still active");
        require(!campaign.goalReached, "Campaign goal was reached");
        require(userContributions[_campaignId][msg.sender] > 0, "No contribution to refund");
        
        uint256 refundAmount = userContributions[_campaignId][msg.sender];
        userContributions[_campaignId][msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund transfer failed");
        
        emit RefundClaimed(_campaignId, msg.sender, refundAmount);
    }
    
    function getCampaignContributions(uint256 _campaignId) external view returns (Contribution[] memory) {
        return campaignContributions[_campaignId];
    }
    
    function getUserCampaigns(address _user) external view returns (uint256[] memory) {
        return userCampaigns[_user];
    }
    
    function getActiveCampaigns() external view returns (Campaign[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < campaignCounter; i++) {
            if (campaigns[i].active && block.timestamp < campaigns[i].deadline) {
                activeCount++;
            }
        }
        
        Campaign[] memory activeCampaigns = new Campaign[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < campaignCounter; i++) {
            if (campaigns[i].active && block.timestamp < campaigns[i].deadline) {
                activeCampaigns[index] = campaigns[i];
                index++;
            }
        }
        
        return activeCampaigns;
    }
    
    function toggleMaintenanceMode() external onlyOwner {
        maintenanceMode = !maintenanceMode;
        emit MaintenanceModeToggled(maintenanceMode);
    }
    
    function setPlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }
}
