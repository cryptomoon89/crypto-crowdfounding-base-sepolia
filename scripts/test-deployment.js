const { ethers } = require("hardhat")

async function main() {
  console.log("Testing deployed contracts...")

  const [deployer] = await ethers.getSigners()
  console.log("Testing with account:", deployer.address)

  // Replace with actual deployed addresses
  const FUND_TOKEN_ADDRESS = "0x..." // Update after deployment
  const CROWDFUNDING_ADDRESS = "0x..." // Update after deployment

  // Get contract instances
  const FundToken = await ethers.getContractFactory("FundToken")
  const fundToken = FundToken.attach(FUND_TOKEN_ADDRESS)

  const CrowdfundingCampaign = await ethers.getContractFactory("CrowdfundingCampaign")
  const crowdfunding = CrowdfundingCampaign.attach(CROWDFUNDING_ADDRESS)

  // Test token claim
  console.log("Testing token claim...")
  const canClaim = await fundToken.canClaim(deployer.address)
  console.log("Can claim:", canClaim)

  if (canClaim) {
    const claimFee = await fundToken.claimFee()
    console.log("Claim fee:", ethers.utils.formatEther(claimFee), "ETH")

    try {
      const tx = await fundToken.claimTokens(ethers.constants.AddressZero, {
        value: claimFee,
      })
      await tx.wait()
      console.log("Token claim successful!")
    } catch (error) {
      console.error("Token claim failed:", error.message)
    }
  }

  // Test campaign creation
  console.log("Testing campaign creation...")
  try {
    const tx = await crowdfunding.createCampaign(
      "Test Campaign",
      "This is a test campaign for our crowdfunding platform",
      ethers.utils.parseEther("1.0"), // 1 ETH goal
      30, // 30 days duration
    )
    await tx.wait()
    console.log("Campaign creation successful!")
  } catch (error) {
    console.error("Campaign creation failed:", error.message)
  }

  // Get active campaigns
  console.log("Getting active campaigns...")
  try {
    const campaigns = await crowdfunding.getActiveCampaigns()
    console.log("Active campaigns:", campaigns.length)
    campaigns.forEach((campaign, index) => {
      console.log(`Campaign ${index}:`, {
        id: campaign.id.toString(),
        title: campaign.title,
        goal: ethers.utils.formatEther(campaign.goal),
        raised: ethers.utils.formatEther(campaign.amountRaised),
      })
    })
  } catch (error) {
    console.error("Failed to get campaigns:", error.message)
  }

  console.log("Testing completed!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
