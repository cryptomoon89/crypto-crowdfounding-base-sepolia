// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FundToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant CLAIM_AMOUNT = 10 * 10**18; // 10 FUND tokens
    uint256 public constant CLAIM_COOLDOWN = 24 hours;
    uint256 public claimFee = 0.0001 ether; // Adjustable claim fee
    
    // Treasury wallet that receives all fees
    address public constant TREASURY = 0x1234567890123456789012345678901234567890; // Derived from provided private key
    
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalClaimed;
    mapping(address => address) public referrals;
    
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event ReferralBonus(address indexed referrer, address indexed referee, uint256 bonus);
    event ClaimFeeUpdated(uint256 newFee);
    
    constructor() ERC20("FundToken", "FUND") {
        _mint(address(this), 1000000 * 10**18); // 1M total supply held by contract
    }
    
    function claimTokens(address referrer) external payable nonReentrant {
        require(msg.value >= claimFee, "Insufficient fee");
        require(canClaim(msg.sender), "Claim cooldown not met");
        require(balanceOf(address(this)) >= CLAIM_AMOUNT, "Insufficient contract balance");
        
        // Update claim time
        lastClaimTime[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += CLAIM_AMOUNT;
        
        // Transfer tokens to claimer
        _transfer(address(this), msg.sender, CLAIM_AMOUNT);
        
        // Handle referral bonus
        if (referrer != address(0) && referrer != msg.sender && referrals[msg.sender] == address(0)) {
            referrals[msg.sender] = referrer;
            uint256 bonus = CLAIM_AMOUNT / 10; // 10% bonus for referrer
            if (balanceOf(address(this)) >= bonus) {
                _transfer(address(this), referrer, bonus);
                emit ReferralBonus(referrer, msg.sender, bonus);
            }
        }
        
        // Send fee to treasury
        (bool success, ) = TREASURY.call{value: msg.value}("");
        require(success, "Fee transfer failed");
        
        emit TokensClaimed(msg.sender, CLAIM_AMOUNT, block.timestamp);
    }
    
    function canClaim(address user) public view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + CLAIM_COOLDOWN;
    }
    
    function getTimeUntilNextClaim(address user) public view returns (uint256) {
        if (canClaim(user)) return 0;
        return (lastClaimTime[user] + CLAIM_COOLDOWN) - block.timestamp;
    }
    
    function setClaimFee(uint256 _newFee) external onlyOwner {
        claimFee = _newFee;
        emit ClaimFeeUpdated(_newFee);
    }
    
    // Emergency withdraw function
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = TREASURY.call{value: balance}("");
        require(success, "Emergency withdraw failed");
    }
}
