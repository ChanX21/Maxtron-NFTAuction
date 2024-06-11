// Import necessary libraries
import React, { useState } from "react";
import { ethers } from "ethers";
import MaxtroxNFT from "./hardhat/artifacts/contracts/Auction.sol/MaxtroxNFT.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css"



// Define the App component
function App() {
  const [contract, setContract] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [auctionedTokenId, setAuctionedTokenId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftPictureUrl, setNftPictureUrl] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState(null);

  


  // Function to initialize the contract
  const initContract = async () => {
    try {
      let signer = null;

      let provider;
      if (window.ethereum == null) {

        // If MetaMask is not installed, we use the default provider,
        // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
        // so they only have read-only access
        console.log("MetaMask not installed; using read-only defaults")
        provider = ethers.getDefaultProvider()

      } else {

        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum)

        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        // that MetaMask manages for the user.
        signer = await provider.getSigner();

        const contract = new ethers.Contract("0x28e2e7060ffc454724a53c3602b3d458a39f9021", MaxtroxNFT.abi, signer);
        setContract(contract);
        setProvider(provider);
        setSigner(signer);
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };

  // Function to create an auction
  const createAuction = async () => {
    try {
      const endTimeInSeconds = auctionEndTime.getTime() / 1000; // Convert to seconds
      const tx = await contract.createAuction(tokenId, ethers.parseEther(startingPrice), endTimeInSeconds, { gasLimit: 300000 });
      await tx.wait();
      console.log("Auction created successfully");
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  const viewAuction = async (tokenId) => {
    try {
      const auctionDetails = await contract.auctions(tokenId);
      console.log("Auction details:", auctionDetails);
      setAuctionDetails(auctionDetails);
    } catch (error) {
      console.error("Error viewing auction:", error);
    }
  };

  // Function to place a bid
  const placeBid = async () => {
    try {
      const tx = await contract.placeBid(auctionedTokenId, { value: ethers.parseEther(bidAmount), gasLimit: 300000 });
      await tx.wait();
      console.log("Bid placed successfully");
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

   // Function to mint an NFT
   const mintNFT = async () => {
    try {
      const tx = await contract.mintNFT(tokenURI);
      await tx.wait();
      console.log("NFT minted successfully");
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

   // Function to view NFT metadata
   const viewNFT = async () => {
    try {

      const metadata = await contract.tokenURI(tokenId);
      const response = await fetch(metadata);
      const jsonData = await response.json();
  
      
      const name = jsonData.name;
      const description = jsonData.description;
      const pictureUrl = jsonData.image;

      setNftName(name);
      setNftDescription(description);
      setNftPictureUrl(pictureUrl);
    } catch (error) {
      console.error("Error viewing NFT:", error);
    }
  };

  // Function to end an auction
  const endAuction = async (tokenId) => {
    try {
      const tx = await contract.endAuction(tokenId, { gasLimit: 300000 });
      await tx.wait();
      console.log("Auction ended successfully");
    } catch (error) {
      console.error("Error ending auction:", error);
    }
  };


  return (
    <div>
      <h1>Maxtron NFT Auction</h1>
      <button onClick={initContract}>Connect Wallet</button>
      <h2>Create Auction</h2>
      <input type="text" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <input type="text" placeholder="Starting Price" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} />
      <DatePicker
        selected={auctionEndTime}
        onChange={(date) =>{
          setAuctionEndTime(date)
        }}
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Auction End Time"
      />    
      <button onClick={createAuction}>Create Auction</button> <br></br>
      <button onClick={() => viewAuction(auctionedTokenId)}>View Auction</button>
      <input type="text" placeholder="Token ID" value={auctionedTokenId} onChange={(e) => setAuctionedTokenId(e.target.value)} />
      {auctionDetails && (
        <div>
          <p>Starting Price: {ethers.formatEther(auctionDetails.startingPrice)} ETH</p>
          <p>Highest Bid: {ethers.formatEther(auctionDetails.highestBid)} ETH</p>
          <p>Highest Bidder: {auctionDetails.highestBidder}</p>
          <p>Active: {auctionDetails.active ? 'Yes' : 'No'}</p>
          <p>End Time: {new Date(Number(auctionDetails.endTime)*1000).toLocaleString()}</p>
        </div>
      )}
      <h2>Place Bid</h2>
      <input type="text" placeholder="Token ID" value={auctionedTokenId} onChange={(e) => setAuctionedTokenId(e.target.value)} />
      <input type="text" placeholder="Bid Amount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
      <button onClick={placeBid}>Place Bid</button>
      <h2>End Auction</h2>
      <input type="text" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <button onClick={() => endAuction(tokenId)}>End Auction</button>
      <h2>Mint NFT</h2>
      <input type="text" placeholder="Token URI" value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
      <button onClick={mintNFT}>Mint NFT</button>
      <h2>View NFT</h2>
      <input type="text" placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <button onClick={viewNFT}>View NFT</button>
      <div>
        <h3>Name: {nftName}</h3>
        <p>Description: {nftDescription}</p>
        <img src={nftPictureUrl} alt="NFT" />
      </div>
    </div>
  );
}

export default App;
