const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoucherKopi", function () {
  let VoucherKopi, voucherKopi, owner, addr1, addr2;

  // Deploy the contract before each test
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const VoucherKopiFactory = await ethers.getContractFactory("VoucherKopi");
    voucherKopi = await VoucherKopiFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voucherKopi.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await voucherKopi.name()).to.equal("Voucher Kopi");
      expect(await voucherKopi.symbol()).to.equal("KOPI");
    });
  });

  describe("Minting Vouchers", function () {
    it("Should allow the owner to mint a new voucher", async function () {
      const tokenURI = "https://example.com/voucher1.json";
      await expect(voucherKopi.connect(owner).mintVoucher(addr1.address, tokenURI))
        .to.emit(voucherKopi, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);

      expect(await voucherKopi.ownerOf(0)).to.equal(addr1.address);
      expect(await voucherKopi.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should not allow non-owners to mint a new voucher", async function () {
      const tokenURI = "https://example.com/voucher2.json";
      await expect(
        voucherKopi.connect(addr1).mintVoucher(addr2.address, tokenURI)
      ).to.be.reverted;
    });
  });

  describe("Redeeming Vouchers", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/voucher3.json";
      await voucherKopi.connect(owner).mintVoucher(addr1.address, tokenURI);
    });

    it("Should allow the voucher owner to redeem it", async function () {
        await voucherKopi.connect(addr1).redeemVoucher(0);
        expect(await voucherKopi.isRedeemed(0)).to.be.true;
    });
    
    it("Should not allow redeeming a voucher twice", async function () {
        await voucherKopi.connect(addr1).redeemVoucher(0); // First redeem
        await expect(voucherKopi.connect(addr1).redeemVoucher(0)).to.be.revertedWith(
            "This voucher has already been redeemed."
        );
    });

    it("Should not allow a non-owner to redeem a voucher", async function () {
        await expect(voucherKopi.connect(addr2).redeemVoucher(0)).to.be.revertedWith(
            "You are not the owner of this voucher."
        );
    });
    
  });
});
