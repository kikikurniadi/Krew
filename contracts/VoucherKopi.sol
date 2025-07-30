// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VoucherKopi
 * @dev A smart contract for creating and redeeming coffee vouchers as NFTs.
 * The contract owner can mint new vouchers for specified recipients.
 * The NFT owner can redeem the voucher, which is a one-time action.
 */
contract VoucherKopi is ERC721URIStorage, Ownable {
    // Counter for token IDs, starting from 1.
    uint256 private _nextTokenId;

    // Mapping to track whether a voucher (NFT) has been redeemed.
    mapping(uint256 => bool) public isRedeemed;

    /**
     * @dev Initializes the contract, setting the name, symbol, and owner.
     */
    constructor() ERC721("Voucher Kopi", "KOPI") Ownable(msg.sender) {}

    /**
     * @dev Mints a new coffee voucher NFT.
     * @param recipient The address that will receive the minted NFT.
     * @param tokenURI The URI for the NFT's metadata (e.g., pointing to a JSON file).
     * Requirements:
     * - Only the contract owner can call this function.
     */
    function mintVoucher(address recipient, string calldata tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _nextTokenId++;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    /**
     * @dev Redeems a coffee voucher NFT.
     * @param tokenId The ID of the NFT to be redeemed.
     * Requirements:
     * - The caller must be the owner of the NFT.
     * - The voucher must not have been redeemed before.
     */
    function redeemVoucher(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this voucher.");
        require(!isRedeemed[tokenId], "This voucher has already been redeemed.");

        isRedeemed[tokenId] = true;
    }

    /**
     * @dev Returns the total number of vouchers minted so far.
     * In ERC721, totalSupply() from the parent contract already provides this.
     * This function is kept for potential future logic if needed.
     */
    function getTotalVouchers() public view returns (uint256) {
        return _nextTokenId;
    }
}
