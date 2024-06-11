// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MaxtroxNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct Auction {
        address payable seller;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        bool active;
        uint256 endTime;
    }

    mapping(uint256 => Auction) public auctions;

    event NFTMinted(uint256 indexed tokenId, address owner, string tokenURI);
    event AuctionCreated(uint256 indexed tokenId, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

    constructor() ERC721("MaxtroxNFT", "MXTRN") Ownable(msg.sender) {}

    function mintNFT(string memory tokenURI) public returns (uint256) {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(newItemId, msg.sender, tokenURI);

        return newItemId;
    }

    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can create an auction");
        require(startingPrice > 0, "Starting price must be greater than 0");
        require(!auctions[tokenId].active, "Auction already active for this token");

        auctions[tokenId] = Auction({
            seller: payable(msg.sender),
            startingPrice: startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            active: true,
            endTime: block.timestamp + duration
        });

        emit AuctionCreated(tokenId, startingPrice, auctions[tokenId].endTime);
    }

    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction is not active");
        require(ownerOf(tokenId) != msg.sender, "Owner of the token cannot bid in auction");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(msg.value > auction.startingPrice, "Bid must be higher than starting price");
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");

        if (auction.highestBid > 0) {
            auction.highestBidder.transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the token can end an auction");
        require(auction.active, "Auction is not active");

        auction.active = false;

        if (auction.highestBid > 0) {
            auction.seller.transfer(auction.highestBid);
            _transfer(auction.seller, auction.highestBidder, tokenId);
            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        }
    }
}
