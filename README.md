---

[![malichainbg.png](https://i.postimg.cc/FH68LGJp/malichainbg.png)](https://postimg.cc/HrQ6Gwz8)

# MaliChain: Transforming Real Estate Investment in Kenya

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://chatgpt.com/c/LICENSE)  
[![Hedera Blockchain](https://img.shields.io/badge/Hedera-Blockchain-brightgreen.svg)](https://hedera.com/)  
[![Repo](https://img.shields.io/badge/Repo-GitHub-blue.svg)](https://github.com/gethsun1/mali-chain)  
[![React](https://img.shields.io/badge/React-17-blue.svg)](https://reactjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)

Deployed at: [https://mali-chain-nrto.vercel.app/](https://mali-chain-nrto.vercel.app/)

---

## Overview

MaliChain leverages the efficiency and security of the Hedera Blockchain to revolutionize Kenya’s real estate market. By tokenizing properties into NFTs and issuing fractional tokens, our platform unlocks liquidity and democratizes real estate investment for everyday Kenyans. Key components include:

- **Property Registration:**  
  Each property is registered as a unique NFT on Hedera, with rich public metadata (property name, valuation, location, etc.) and sensitive data (KRA PIN, ID number, title deed hash) stored securely off‑chain via Hedera File Service (HFS).

- **Fractional Ownership:**  
  Fractional tokens represent small percentages of property ownership, allowing investments as low as ~KES 220 per token. This makes high‑value assets accessible to a wider pool of investors.

- **Hedera Integration:**  
  We use Hedera Token Service (HTS) for efficient token minting and HFS for cost‑effective off‑chain data storage.

---

## Core Concepts

### Property Registration & NFT Minting
- **NFT Creation:**  
  Properties are minted as NFTs using an ERC721-based smart contract. Each NFT’s `propertyURI` points to off‑chain metadata stored via HFS.
  
- **Rich Metadata:**  
  The metadata includes:
  - **Public Details:** Property Name, Valuation (KES), Location, Type, Geo‑Coordinates, Bedrooms, and Swimming Pool availability.
  - **Sensitive Data:** KRA PIN, ID number, and Title Deed (stored as hashed values for privacy).

### Fractional Ownership & Revenue Distribution
- **Fractional Tokens:**  
  After a property is registered, fractional tokens are issued to represent partial ownership. For example, setting each token to represent 0.001% of the property’s value makes investments affordable.
  
- **Revenue Sharing:**  
  Rental income or other revenue is collected and distributed proportionally to fractional token holders, ensuring transparent income sharing.

### Hedera Token & File Services (HTS & HFS)
- **HTS:**  
  Enables rapid, secure, and eco‑friendly minting of both NFTs and fractional tokens.
- **HFS:**  
  Stores large data files (property images, detailed reports, metadata JSON) off‑chain. The file ID from HFS is used as a pointer in the NFT metadata, reducing on‑chain storage costs.

---

## Smart Contract Architecture

### Property Registry Smart Contract

This contract registers properties as NFTs with detailed metadata.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/extensions/ERC721URIStorage.sol?raw=true";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol?raw=true";

contract PropertyRegistry is ERC721URIStorage, Ownable {
    uint256 public nextPropertyId;

    struct PublicProperty {
        string propertyName;
        string propertyURI;    // Off-chain metadata pointer via HFS
        uint256 valuation;     // In KES
        string locationName;
        string propertyType;
        string geoCoordinates;
        uint8 bedrooms;
        bool hasSwimmingPool;
    }

    struct PrivateProperty {
        string kraPin;         // Hashed for KYC/AML
        string idNumber;       // Hashed for privacy
        bytes32 titleDeedHash; // Hash of the title deed document
    }

    mapping(uint256 => PublicProperty) public publicProperties;
    mapping(uint256 => PrivateProperty) private privateProperties;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);

    constructor() ERC721("MaliChainProperty", "MCP") {}

    function registerProperty(
        address to,
        PublicProperty calldata pubData,
        PrivateProperty calldata privData
    ) external onlyOwner returns (uint256) {
        uint256 propertyId = nextPropertyId;
        _safeMint(to, propertyId);
        _setTokenURI(propertyId, pubData.propertyURI);

        publicProperties[propertyId] = PublicProperty({
            propertyName: pubData.propertyName,
            propertyURI: pubData.propertyURI,
            valuation: pubData.valuation,
            locationName: pubData.locationName,
            propertyType: pubData.propertyType,
            geoCoordinates: pubData.geoCoordinates,
            bedrooms: pubData.bedrooms,
            hasSwimmingPool: pubData.hasSwimmingPool
        });

        privateProperties[propertyId] = PrivateProperty({
            kraPin: privData.kraPin,
            idNumber: privData.idNumber,
            titleDeedHash: privData.titleDeedHash
        });

        nextPropertyId++;
        emit PropertyRegistered(propertyId, to);
        return propertyId;
    }

    function getPrivateProperty(uint256 propertyId) external view onlyOwner returns (PrivateProperty memory) {
        return privateProperties[propertyId];
    }
}
```

### Fractional Token & Revenue Distribution Smart Contract

This contract issues fractional tokens representing property ownership and distributes revenue to token holders.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalToken is ERC20, Ownable {
    uint256 public constant TOTAL_FRACTIONS = 100000;
    uint256 public totalRevenue;
    mapping(address => uint256) public revenueClaimed;

    event RevenueDeposited(uint256 amount);
    event RevenueClaimed(address indexed account, uint256 amount);

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _mint(msg.sender, TOTAL_FRACTIONS);
    }

    function depositRevenue() external payable onlyOwner {
        require(msg.value > 0, "No revenue sent");
        totalRevenue += msg.value;
        emit RevenueDeposited(msg.value);
    }

    function claimRevenue() external {
        uint256 holderBalance = balanceOf(msg.sender);
        require(holderBalance > 0, "No tokens held");
        uint256 entitled = (totalRevenue * holderBalance) / TOTAL_FRACTIONS;
        uint256 alreadyClaimed = revenueClaimed[msg.sender];
        require(entitled > alreadyClaimed, "No revenue to claim");
        uint256 claimable = entitled - alreadyClaimed;
        revenueClaimed[msg.sender] += claimable;
        payable(msg.sender).transfer(claimable);
        emit RevenueClaimed(msg.sender, claimable);
    }
}
```

### Demo KES Token (Optional)

An ERC20 token representing the Kenyan Shilling for demo purposes:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KEStableCoin is ERC20 {
    constructor(uint256 initialSupply) ERC20("Kenyan Shilling", "KES") {
        _mint(msg.sender, initialSupply);
    }
}
```

---

## Hedera Integration

We use **Hedera Token Service (HTS)** for fast and secure token minting, and **Hedera File Service (HFS)** to store large off‑chain data such as property images and detailed metadata. The file ID returned from HFS is stored on‑chain as the property URI, ensuring efficient data storage and retrieval.

### HFS Helper Functions (Extract)

```ts
import {
  Client,
  FileCreateTransaction,
  Hbar,
  TransactionReceipt,
  FileId,
} from "@hashgraph/sdk";

const client = Client.forTestnet();
client.setOperator(process.env.OPERATOR_ACCOUNT_ID!, process.env.OPERATOR_PRIVATE_KEY!);

export async function uploadFileToHFS(contents: string): Promise<string> {
  const fileCreateTx = new FileCreateTransaction()
    .setKeys([client.operatorKey])
    .setContents(contents)
    .setMaxTransactionFee(new Hbar(2));
  const fileCreateSubmit = await fileCreateTx.execute(client);
  const fileCreateReceipt: TransactionReceipt = await fileCreateSubmit.getReceipt(client);
  const fileId: FileId | null = fileCreateReceipt.fileId;
  if (!fileId) {
    throw new Error("File creation failed, fileId is null");
  }
  return fileId.toString();
}

export async function uploadPropertyMetadataToHFS(
  imageContents: string,
  metadata: object
): Promise<string> {
  const imageFileId = await uploadFileToHFS(imageContents);
  const enrichedMetadata = {
    ...metadata,
    propertyImage: imageFileId,
  };
  const metadataJSON = JSON.stringify(enrichedMetadata);
  const metadataFileId = await uploadFileToHFS(metadataJSON);
  return metadataFileId;
}
```

---

## Current Status & Future Plans

**MaliChain is a work in progress.** As I continue learning and building on the Hedera network, I'm refining the platform's functionality and security. For this MVP:
- Property registration is handled via NFT minting.
- Fractional ownership is enabled with a dedicated ERC20 token.
- Off-chain metadata (including property images) is stored using HFS.

### Future Plans:
- **Partnership with the Nairobi Stock Exchange:**  
  To introduce REITs and further align with regulated capital markets.
- **Collaboration with KenInvest:**  
  To attract more local investors and integrate formal investment processes.
- **Enhanced Governance:**  
  Implement DAO-based property management for a more decentralized decision‑making process.
- **Advanced Revenue Distribution:**  
  Integrate real‑time data via oracles for dynamic revenue sharing.

---

## Contributing

I'm excited to collaborate with developers and investors passionate about blockchain and real estate. If you'd like to contribute:
- Open issues and submit feature requests.
- Fork the repository and submit pull requests.
- Join our community discussions and share your ideas.

Your feedback and contributions are invaluable as we continue to evolve MaliChain.

---

---
