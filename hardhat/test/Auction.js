const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MaxtroxNFT", function () {
  let MaxtroxNFT, maxtroxNFT, owner, addr1, addr2;

  beforeEach(async function () {
    MaxtroxNFT = await ethers.deployContract("MaxtroxNFT");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  describe("Minting NFTs", function () {
    it("Should mint a new NFT and assign it to the owner", async function () {
      const tokenURI = "https://example.com/token1";
      await expect(maxtroxNFT.mintNFT(tokenURI))
        .to.emit(maxtroxNFT, "NFTMinted")
        .withArgs(1, owner.address, tokenURI);

      expect(await maxtroxNFT.ownerOf(1)).to.equal(owner.address);
    });
  });

  describe("Creating Auctions", function () {
    it("Should allow the owner to create an auction", async function () {
      const tokenURI = "https://example.com/token1";
      await maxtroxNFT.mintNFT(tokenURI);
      const tokenId = 1;
      const startingPrice = ethers.utils.parseEther("1");
      const duration = 3600; // 1 hour

      await expect(maxtroxNFT.createAuction(tokenId, startingPrice, duration))
        .to.emit(maxtroxNFT, "AuctionCreated")
        .withArgs(
          tokenId,
          startingPrice,
          (await ethers.provider.getBlock("latest")).timestamp + duration
        );

      const auction = await maxtroxNFT.auctions(tokenId);
      expect(auction.active).to.be.true;
    });

    it("Should not allow non-owners to create an auction", async function () {
      const tokenURI = "https://example.com/token1";
      await maxtroxNFT.mintNFT(tokenURI);
      const tokenId = 1;
      const startingPrice = ethers.utils.parseEther("1");
      const duration = 3600; // 1 hour

      await expect(
        maxtroxNFT
          .connect(addr1)
          .createAuction(tokenId, startingPrice, duration)
      ).to.be.revertedWith("Only the owner of the token can create an auction");
    });
  });

  describe("Placing Bids", function () {
    it("Should allow users to place bids", async function () {
      const tokenURI = "https://example.com/token1";
      await maxtroxNFT.mintNFT(tokenURI);
      const tokenId = 1;
      const startingPrice = ethers.utils.parseEther("1");
      const duration = 3600; // 1 hour

      await maxtroxNFT.createAuction(tokenId, startingPrice, duration);

      await expect(
        maxtroxNFT
          .connect(addr1)
          .placeBid(tokenId, { value: ethers.utils.parseEther("2") })
      )
        .to.emit(maxtroxNFT, "BidPlaced")
        .withArgs(tokenId, addr1.address, ethers.utils.parseEther("2"));

      const auction = await maxtroxNFT.auctions(tokenId);
      expect(auction.highestBid).to.equal(ethers.utils.parseEther("2"));
      expect(auction.highestBidder).to.equal(addr1.address);
    });

    it("Should reject bids lower than the current highest bid", async function () {
      const tokenURI = "https://example.com/token1";
      await maxtroxNFT.mintNFT(tokenURI);
      const tokenId = 1;
      const startingPrice = ethers.utils.parseEther("1");
      const duration = 3600; // 1 hour

      await maxtroxNFT.createAuction(tokenId, startingPrice, duration);

      await maxtroxNFT
        .connect(addr1)
        .placeBid(tokenId, { value: ethers.utils.parseEther("2") });

      await expect(
        maxtroxNFT
          .connect(addr2)
          .placeBid(tokenId, { value: ethers.utils.parseEther("1.5") })
      ).to.be.revertedWith("Bid must be higher than current highest bid");
    });
  });

  describe("Ending Auctions", function () {
    it("Should allow the owner to end an auction", async function () {
      const tokenURI = "https://example.com/token1";
      await maxtroxNFT.mintNFT(tokenURI);
      const tokenId = 1;
      const startingPrice = ethers.utils.parseEther("1");
      const duration = 3600; // 1 hour

      await maxtroxNFT.createAuction(tokenId, startingPrice, duration);

      await maxtroxNFT
        .connect(addr1)
        .placeBid(tokenId, { value: ethers.utils.parseEther("2") });

      await ethers.provider.send("evm_increaseTime", [duration + 1]);
      await ethers.provider.send("evm_mine");

      await expect(maxtroxNFT.endAuction(tokenId))
        .to.emit(maxtroxNFT, "AuctionEnded")
        .withArgs(tokenId, addr1.address, ethers.utils.parseEther("2"));

      expect(await maxtroxNFT.ownerOf(tokenId)).to.equal(addr1.address);
    });
  });
});
