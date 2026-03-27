# Podcast-DApp
# 🎙️ Stellar Cast: Decentralized Podcast Platform


## Project Description
Stellar Cast is a decentralized podcasting dApp built on the Stellar network using Soroban smart contracts. It aims to give content creators full ownership over their audio content by decoupling the hosting and distribution from centralized platforms. By leveraging Stellar's fast and low-cost network alongside decentralized storage (like IPFS), Stellar Cast ensures podcasts are censorship-resistant, verifiable, and permanently accessible.

## What It Does
This Soroban smart contract acts as the on-chain registry for podcast episodes. It allows podcasters to securely register their new episodes on the Stellar blockchain. When a creator uploads an audio file to a decentralized storage network (such as IPFS), they can use this smart contract to permanently link their Stellar wallet address to the episode's metadata (Title and Audio URI). Listeners and front-end clients can then query the blockchain to fetch the catalog of episodes without relying on a central database.

## Features
* **Authentication & Ownership:** Enforces `require_auth()` to ensure only the owner of a wallet address can publish content under their name.
* **Immutable Registry:** Stores podcast metadata (Title, Creator Address, and Audio URI) permanently on the Stellar ledger using Soroban's persistent storage.
* **On-Chain Indexing:** Automatically generates sequential IDs for easy querying and tracks the global total of published episodes.
* **Decentralized Storage Friendly:** Designed to seamlessly integrate with IPFS or Arweave CIDs for off-chain heavy audio files, keeping on-chain gas fees minimal.

* #### Contract - CC2BSVQUVW7FITTIEI2ZNUDMGVOSFYGG75RVJLDCLAVZMO2TFOW3CI3K
<img width="1914" height="875" alt="image" src="https://github.com/user-attachments/assets/8d2959a3-6464-4816-a7f3-468c2c9b218f" />

## Getting Started

### Prerequisites
* Rust toolchain
* Soroban CLI installed (`cargo install --locked soroban-cli`)

### Build
To build the contract, run:
```bash
cargo build --target wasm32-unknown-unknown --release
