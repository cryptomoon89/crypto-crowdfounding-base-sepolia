# CryptoFund - Decentralized Crowdfunding Platform

A complete Web3 crowdfunding platform built on Base Sepolia testnet with daily token claims, advanced UI, and comprehensive smart contract functionality.

## 🚀 Features

### Smart Contracts
- **FundToken (ERC-20)**: Custom token with daily claim mechanism
- **CrowdfundingCampaign**: Full-featured crowdfunding with refunds and fee routing
- **Security**: Reentrancy protection, proper access controls, and gas optimization

### Frontend
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion
- **Web3 Integration**: OnchainKit, Wagmi, and RainbowKit for seamless wallet connection
- **Visual Effects**: Lottie animations, confetti, and gradient effects
- **Responsive Design**: Mobile-first approach with dark mode support

### Key Functionality
- 🪙 **Daily Token Claims**: Claim 10 FUND tokens every 24 hours
- 🎯 **Campaign Creation**: Launch crowdfunding campaigns with goals and deadlines
- 💰 **Smart Contributions**: Automatic refunds if goals aren't met
- 🏆 **Leaderboards**: Track top contributors and campaign creators
- 🔗 **Referral System**: Earn bonus tokens for referrals
- 🛡️ **Security**: All fees routed to treasury wallet automatically

## 🛠️ Setup & Deployment

### Prerequisites
- Node.js 18+
- Hardhat
- Base Sepolia testnet ETH (from faucet)

### Installation

1. **Clone and install dependencies**
\`\`\`bash
git clone <repository>
cd crypto-crowdfunding-base
npm install
\`\`\`

2. **Configure environment**
\`\`\`bash
cp .env.example .env
# Update .env with your keys and RPC URLs
\`\`\`

3. **Compile contracts**
\`\`\`bash
npm run compile
\`\`\`

4. **Deploy to Base Sepolia**
\`\`\`bash
npm run deploy
\`\`\`

5. **Update contract addresses**
Update `lib/contracts.ts` with deployed addresses

6. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

\`\`\`env
PRIVATE_KEY=0x6c9fd6acd369356d4b02698bb7e1d393a4225aea551736e074f6723bd38ef4bf
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
\`\`\`

## 📋 Smart Contract Details

### FundToken Contract
- **Symbol**: FUND
- **Total Supply**: 1,000,000 FUND
- **Claim Amount**: 10 FUND per claim
- **Claim Cooldown**: 24 hours
- **Claim Fee**: 0.0001 ETH (adjustable)
- **Referral Bonus**: 10% for referrers

### CrowdfundingCampaign Contract
- **Platform Fee**: 2.5% of successful campaigns
- **Refund System**: Automatic refunds for failed campaigns
- **Goal Tracking**: Real-time progress monitoring
- **Maintenance Mode**: Emergency pause functionality

## 🔧 Testing

### Run Contract Tests
\`\`\`bash
npx hardhat test
\`\`\`

### Test Deployed Contracts
\`\`\`bash
node scripts/test-deployment.js
\`\`\`

### Manual Testing Checklist
- [ ] Wallet connection (MetaMask, Coinbase Wallet)
- [ ] Token claiming with cooldown
- [ ] Campaign creation and contribution
- [ ] Refund mechanism for failed campaigns
- [ ] Fee routing to treasury wallet
- [ ] Referral bonus system
- [ ] Visual effects and animations

## 🌐 Base Sepolia Configuration

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## 🎨 UI Features

### Visual Effects
- Lottie animations for hero section
- Confetti on successful actions
- Gradient backgrounds and text
- Smooth transitions with Framer Motion
- Glow effects on interactive elements

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Dark mode support
- Accessible color contrasts

## 🔒 Security Features

### Smart Contract Security
- ReentrancyGuard on all payable functions
- Proper access controls with Ownable
- Input validation and bounds checking
- Emergency pause functionality
- Automatic fee routing to secure treasury

### Frontend Security
- Input sanitization
- Proper error handling
- Secure wallet connection
- Transaction confirmation flows

## 🚀 Deployment Guide

### 1. Pre-deployment
- Ensure Base Sepolia ETH in deployer wallet
- Verify all environment variables
- Test contracts on local network

### 2. Deploy Contracts
\`\`\`bash
npm run deploy
\`\`\`

### 3. Verify Contracts (Optional)
\`\`\`bash
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS>
\`\`\`

### 4. Update Frontend
- Update contract addresses in `lib/contracts.ts`
- Test all functionality
- Deploy frontend to Vercel

### 5. Post-deployment Testing
- Test token claims
- Create test campaigns
- Verify fee routing
- Check all visual effects

## 📊 Maintenance

### Monitoring
- Track contract interactions
- Monitor treasury wallet balance
- Check for failed transactions
- Review user feedback

### Updates
- Smart contract upgrades (if needed)
- Frontend improvements
- Security patches
- Feature additions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and support:
- Create GitHub issue
- Check documentation
- Review smart contract code
- Test on Base Sepolia testnet

---

Built with ❤️ on Base Sepolia testnet
