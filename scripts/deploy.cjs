const hre = require('hardhat');

async function main() {
  const VoucherKopi = await hre.ethers.getContractFactory('VoucherKopi');
  const voucherKopi = await VoucherKopi.deploy();

  await voucherKopi.waitForDeployment();

  console.log(`VoucherKopi deployed to: ${voucherKopi.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
