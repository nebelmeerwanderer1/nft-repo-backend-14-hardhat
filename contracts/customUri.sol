// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotOwnerOfNFT();

contract customUri is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event CreatedNFT(uint256 indexed tokenId, string tokenURI, address owner);
    event UpdatedTokenUri(uint256 indexed tokenId, string tokenURI, address owner);
    event CurrentOwner(uint256 indexed tokenId, address owner);

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        emit CreatedNFT(newItemId, tokenURI, ownerOf(newItemId));
        return newItemId;
    }

    function updateNFT(
        address owner,
        uint256 tokenId,
        string memory tokenURI
    ) public returns (bool) {
        _requireMinted(tokenId);

        if (ownerOf(tokenId) != owner) {
            revert NotOwnerOfNFT();
        }

        _setTokenURI(tokenId, tokenURI);
        emit UpdatedTokenUri(tokenId, tokenURI, ownerOf(tokenId));

        return true;
    }

    function currentOwner(uint256 tokenId) public {
        emit CurrentOwner(tokenId, ownerOf(tokenId));
    }

    function getTokenCounter() public view returns (uint256) {
        return _tokenIds.current();
    }
}
