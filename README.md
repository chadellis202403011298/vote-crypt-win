# ElectionBet - Encrypted Election Prediction Market

A privacy-preserving election prediction market built with Fully Homomorphic Encryption (FHE) on Ethereum Sepolia testnet. Users can place encrypted bets on election outcomes where candidate choices and bet amounts remain completely private until results are officially declared.

## 🎯 Features

- **Complete Privacy**: All predictions are encrypted using Zama FHE before submission to the blockchain
- **Secure Betting**: Candidate selection and bet amounts are processed as ciphertext on-chain
- **Fair Settlement**: Automated payout distribution based on encrypted vote tallies
- **Modern UI**: Beautiful, responsive interface built with React + shadcn/ui
- **Web3 Integration**: Seamless wallet connection with MetaMask, WalletConnect, and Safe

## 🏗️ Architecture

### Smart Contract Layer
- **ElectionBettingPool.sol**: Main contract managing encrypted predictions
  - Uses `@fhevm/solidity` for FHE operations
  - Implements fail-closed security model
  - Role-based access control for election management
  - Gateway decryption for payouts

### Frontend Layer
- **React + Vite**: Fast development and optimized production builds
- **Wagmi v2 + RainbowKit**: Web3 wallet connectivity
- **Zama FHE SDK**: Browser-based encryption (v0.2.0)
- **shadcn/ui**: Beautiful, accessible component library
- **TanStack Query**: Efficient blockchain data fetching

## 📋 Prerequisites

- Node.js >= 18.x
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia ETH for gas fees

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/chadellis202403011298/vote-crypt-win
cd vote-crypt-win
npm install
```

### 2. Environment Configuration

Configure `.env`:

```bash
# Blockchain Configuration
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
ADDRESS=your_wallet_address_here

# Frontend Configuration
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_ELECTION_CONTRACT_ADDRESS=deployed_contract_address
```

### 3. Development

```bash
# Compile contracts
npm run hardhat:compile

# Run tests
npm run hardhat:test

# Deploy to Sepolia
npm run deploy:sepolia

# Start frontend
npm run dev
```

## 🛠️ Technology Stack

- Solidity ^0.8.24
- @fhevm/solidity ^0.8.0
- @zama-fhe/relayer-sdk 0.2.0
- React ^18.3.1
- Wagmi ^2.13.5
- RainbowKit ^2.2.3
- Vite ^5.4.19
- shadcn/ui

## 📄 License

MIT
