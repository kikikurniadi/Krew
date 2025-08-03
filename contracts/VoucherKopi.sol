// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title VoucherKopi
 * @dev A smart contract for creating, redeeming, and managing tiered coffee vouchers as NFTs.
 */
contract VoucherKopi is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    enum VoucherType { Espresso, Cappuccino, Luwak }

    struct Voucher {
        VoucherType voucherType;
        bool isRedeemed;
    }
    
    struct VoucherData {
        uint256 tokenId;
        address owner;
        string tokenURI;
        VoucherType voucherType;
        bool isRedeemed;
    }

    mapping(uint256 => Voucher) public voucherDetails;
    mapping(address => uint256) public redeemedCount;
    mapping(uint256 => bool) private _activeTokenIds;

    constructor() ERC721("Voucher Kopi", "KOPI") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    function mintVoucher(address recipient, string calldata tokenURI, VoucherType voucherType)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _nextTokenId++;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        voucherDetails[newItemId] = Voucher({
            voucherType: voucherType,
            isRedeemed: false
        });
        _activeTokenIds[newItemId] = true;

        return newItemId;
    }

    function redeemVoucher(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the voucher owner can redeem.");
        _redeem(tokenId, msg.sender);
    }

    function redeemVoucherByOwner(uint256 tokenId) public onlyOwner {
        address voucherHolder = ownerOf(tokenId);
        _redeem(tokenId, voucherHolder);
    }

    function _redeem(uint256 tokenId, address user) internal {
        Voucher storage voucher = voucherDetails[tokenId];
        require(!voucher.isRedeemed, "This voucher has already been redeemed.");

        voucher.isRedeemed = true;
        redeemedCount[user]++;
    }

    function getVoucherDetails(uint256 tokenId) public view returns (VoucherType, bool) {
        Voucher storage voucher = voucherDetails[tokenId];
        return (voucher.voucherType, voucher.isRedeemed);
    }
    
    function getVouchersByOwner(address owner) public view returns (VoucherData[] memory) {
        uint256 ownerBalance = balanceOf(owner);
        if (ownerBalance == 0) {
            return new VoucherData[](0);
        }

        VoucherData[] memory usersVouchers = new VoucherData[](ownerBalance);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_activeTokenIds[i] && ownerOf(i) == owner) {
                usersVouchers[currentIndex] = _getVoucherData(i);
                currentIndex++;
            }
        }
        return usersVouchers;
    }

    function getAllVouchers() public view returns (VoucherData[] memory) {
        uint256 totalVouchers = 0;
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_activeTokenIds[i]) {
                totalVouchers++;
            }
        }

        VoucherData[] memory allVouchers = new VoucherData[](totalVouchers);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_activeTokenIds[i]) {
                 allVouchers[currentIndex] = _getVoucherData(i);
                 currentIndex++;
            }
        }
        return allVouchers;
    }

    function _getVoucherData(uint256 tokenId) internal view returns (VoucherData memory) {
        Voucher storage voucher = voucherDetails[tokenId];
        return VoucherData({
            tokenId: tokenId,
            owner: ownerOf(tokenId),
            tokenURI: tokenURI(tokenId),
            voucherType: voucher.voucherType,
            isRedeemed: voucher.isRedeemed
        });
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721) returns (address) {
        if (to == address(0)) {
            _activeTokenIds[tokenId] = false;
        }
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
