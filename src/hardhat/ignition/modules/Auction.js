// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  const MaxtroxNFT = await ethers.getContractFactory("MaxtroxNFT");
  const maxtroxNFT = await MaxtroxNFT.deploy();

  console.log("MaxtroxNFT contract deployed to:", maxtroxNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
