// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/token/ERC721/extensions/ERC721URIStorage.sol?raw=true";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.8/contracts/access/Ownable.sol?raw=true";

contract PropertyRegistry is ERC721URIStorage, Ownable {
    uint256 public nextPropertyId;

    // Struct for public property metadata.
    struct PublicProperty {
        string propertyName;
        string propertyURI;
        uint256 valuation;
        string locationName;
        string propertyType;
        string geoCoordinates;
        uint8 bedrooms;
        bool hasSwimmingPool;
    }

    // Struct for private property details.
    struct PrivateProperty {
        string kraPin;
        string idNumber;
        bytes32 titleDeedHash;
    }

    // Input structs to reduce parameters in registerProperty
    struct PublicPropertyInput {
        string propertyName;
        string propertyURI;
        uint256 valuation;
        string locationName;
        string propertyType;
        string geoCoordinates;
        uint8 bedrooms;
        bool hasSwimmingPool;
    }

    struct PrivatePropertyInput {
        string kraPin;
        string idNumber;
        bytes32 titleDeedHash;
    }

    // Mappings for storing property metadata
    mapping(uint256 => PublicProperty) public publicProperties;
    mapping(uint256 => PrivateProperty) private privateProperties;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner);

    constructor() ERC721("MaliChainProperty", "MCP") {}

    // Only admin can register a new property NFT.
    function registerProperty(
        address to,
        PublicPropertyInput calldata pubData,
        PrivatePropertyInput calldata privData
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

    // Admin-only function to view private property details.
    function getPrivateProperty(uint256 propertyId) external view onlyOwner returns (PrivateProperty memory) {
        return privateProperties[propertyId];
    }
}
