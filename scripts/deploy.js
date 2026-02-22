const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const CredentialRegistry = await hre.ethers.getContractFactory("CredentialRegistry");
  
  // Deploy the contract
  const registry = await CredentialRegistry.deploy();

  // Wait for deployment to finish
  await registry.waitForDeployment();

  console.log("-----------------------------------------");
  console.log("CredentialRegistry deployed to:", await registry.getAddress());
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});