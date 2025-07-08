export const CONTRACTS = {
  FUND_TOKEN: "0x...", // Will be updated after deployment
  CROWDFUNDING: "0x...", // Will be updated after deployment
}

export const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  name: "Base Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.basescan.org",
  rpcUrl: "https://sepolia.base.org",
}

export const FUND_TOKEN_ABI = [
  "function claimTokens(address referrer) external payable",
  "function canClaim(address user) external view returns (bool)",
  "function getTimeUntilNextClaim(address user) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalClaimed(address user) external view returns (uint256)",
  "function claimFee() external view returns (uint256)",
  "event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event ReferralBonus(address indexed referrer, address indexed referee, uint256 bonus)",
]

export const CROWDFUNDING_ABI = [
  "function createCampaign(string memory title, string memory description, uint256 goal, uint256 durationInDays) external",
  "function contribute(uint256 campaignId) external payable",
  "function withdrawFunds(uint256 campaignId) external",
  "function claimRefund(uint256 campaignId) external",
  "function getActiveCampaigns() external view returns (tuple(uint256 id, string title, string description, address owner, uint256 goal, uint256 deadline, uint256 amountRaised, bool goalReached, bool fundsWithdrawn, bool active, uint256 createdAt)[])",
  "function campaigns(uint256) external view returns (uint256 id, string title, string description, address owner, uint256 goal, uint256 deadline, uint256 amountRaised, bool goalReached, bool fundsWithdrawn, bool active, uint256 createdAt)",
  "function userContributions(uint256, address) external view returns (uint256)",
  "function totalContributed(address) external view returns (uint256)",
  "function totalRaised(address) external view returns (uint256)",
  "event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title, uint256 goal, uint256 deadline)",
  "event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount)",
  "event GoalReached(uint256 indexed campaignId, uint256 totalRaised)",
]
