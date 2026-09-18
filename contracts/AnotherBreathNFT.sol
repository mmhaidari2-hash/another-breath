// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Another Breath — Biological 1/1 NFT
 * Each token is bound to a unique breathHash (SHA-256 of local breath DNA).
 * Audio never leaves the user's device; only the hash + metadata URI are on-chain.
 */
contract AnotherBreathNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId = 1;
    mapping(bytes32 => uint256) public tokenOfBreath;
    mapping(uint256 => bytes32) public breathOfToken;

    event BreathMinted(address indexed to, uint256 indexed tokenId, bytes32 breathHash, string tokenURI);

    constructor() ERC721("Another Breath", "ABREATH") Ownable(msg.sender) {}

    function mintBreath(bytes32 breathHash, string calldata uri) external returns (uint256 tokenId) {
        require(breathHash != bytes32(0), "empty hash");
        require(tokenOfBreath[breathHash] == 0, "already minted");
        tokenId = nextTokenId++;
        tokenOfBreath[breathHash] = tokenId;
        breathOfToken[tokenId] = breathHash;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        emit BreathMinted(msg.sender, tokenId, breathHash, uri);
    }

    function existsBreath(bytes32 breathHash) external view returns (bool) {
        return tokenOfBreath[breathHash] != 0;
    }
}
