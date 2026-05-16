import hre from "hardhat";

async function main() {
  const ethers = (hre as typeof hre & { ethers: any }).ethers;
  const asset = process.env.VAULT_ASSET_ADDRESS;

  if (!asset) {
    throw new Error("VAULT_ASSET_ADDRESS is required");
  }

  const vaultFactory = await ethers.getContractFactory("AegisTreasuryVault");
  const vault = await vaultFactory.deploy(asset);
  await vault.waitForDeployment();

  const moduleFactory = await ethers.getContractFactory("AegisExecutionModule");
  const module = await moduleFactory.deploy(await vault.getAddress());
  await module.waitForDeployment();

  console.log("AegisTreasuryVault:", await vault.getAddress());
  console.log("AegisExecutionModule:", await module.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
