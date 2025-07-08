const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying contracts to Base Sepolia...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy FundToken
  console.log("Deploying FundToken...")
  const FundToken = await ethers.getContractFactory("FundToken")
  const fundToken = await FundToken.deploy()
  await fundToken.deployed()
  console.log("FundToken deployed to:", fundToken.address)

  // Deploy CrowdfundingCampaign
  console.log("Deploying CrowdfundingCampaign...")
  const CrowdfundingCampaign = await ethers.getContractFactory("CrowdfundingCampaign")
  const crowdfunding = await CrowdfundingCampaign.deploy(fundToken.address)
  await crowdfunding.deployed()
  console.log("CrowdfundingCampaign deployed to:", crowdfunding.address)

  // Save deployment addresses
  const deploymentInfo = {
    network: "base-sepolia",
    fundToken: fundToken.address,
    crowdfunding: crowdfunding.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  }

  console.log("Deployment completed!")
  console.log("Deployment info:", deploymentInfo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
