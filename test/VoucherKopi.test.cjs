const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoucherKopi", function () {
  let VoucherKopi, voucherKopi, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const VoucherKopiFactory = await ethers.getContractFactory("VoucherKopi");
    voucherKopi = await VoucherKopiFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await voucherKopi.owner()).to.equal(owner.address);
    });
  });

  describe("Minting Vouchers", function () {
    it("Should allow the owner to mint a new voucher", async function () {
      await expect(voucherKopi.mintVoucher(addr1.address, "test_uri", 0))
        .to.emit(voucherKopi, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 1);
      
      const voucherDetails = await voucherKopi.getVoucherDetails(1);
      expect(voucherDetails[0]).to.equal(0); // Espresso
      expect(voucherDetails[1]).to.be.false; // isRedeemed
    });

    it("Should not allow non-owners to mint a new voucher", async function () {
        await expect(
            voucherKopi.connect(addr1).mintVoucher(addr2.address, "test_uri", 1)
        ).to.be.revertedWithCustomError(voucherKopi, "OwnableUnauthorizedAccount").withArgs(addr1.address);
    });
  });

  describe("Redeeming Vouchers", function () {
    beforeEach(async function () {
      await voucherKopi.mintVoucher(addr1.address, "test_uri", 0);
    });

    it("Should allow the voucher owner to redeem it", async function () {
      await voucherKopi.connect(addr1).redeemVoucher(1);
      const voucherDetails = await voucherKopi.getVoucherDetails(1);
      expect(voucherDetails[1]).to.be.true; // isRedeemed
    });

    it("Should not allow non-owners to redeem a voucher", async function () {
      await expect(
        voucherKopi.connect(addr2).redeemVoucher(1)
      ).to.be.revertedWith("Only the voucher owner can redeem.");
    });

    it("Should not allow redeeming a voucher twice", async function () {
      await voucherKopi.connect(addr1).redeemVoucher(1);
      await expect(
        voucherKopi.connect(addr1).redeemVoucher(1)
      ).to.be.revertedWith("This voucher has already been redeemed.");
    });
  });
});
