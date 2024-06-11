# MaxtroxNFT Contract

This contract is an implementation of an NFT (Non-Fungible Token) auction system on the Ethereum blockchain. It allows users to mint NFTs, create auctions for them, place bids, and end auctions.

## Features

- **Mint NFT**: Users can mint new NFTs with associated metadata.
- **Create Auction**: NFT owners can create auctions for their tokens, specifying starting price and duration.
- **Place Bid**: Users can place bids on active auctions.
- **End Auction**: NFT owners can end auctions manually, transferring the token to the highest bidder and collecting the bid amount.

## Getting Started

To interact with the MaxtroxNFT contract, you can deploy it on the Ethereum blockchain or use an existing deployment. You'll need to use a tool like Remix, Hardhat, or Truffle to deploy the contract.

## Usage

Here's how you can interact with the contract functions:

- **mintNFT(string memory tokenURI)**: Mint a new NFT with the provided token URI.
- **createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration)**: Create an auction for the specified token ID with the given starting price and duration.
- **placeBid(uint256 tokenId)**: Place a bid on an active auction for the specified token ID.
- **endAuction(uint256 tokenId)**: End an active auction for the specified token ID, transferring the token to the highest bidder and collecting the bid amount.

## Deployment

You can deploy the MaxtroxNFT contract to the Ethereum blockchain using Remix, Hardhat, Truffle, or another Ethereum development tool. Make sure to set the appropriate parameters, such as gas limit and initial token supply.

## Contributing

Contributions to this contract implementation are welcome. If you find any issues or have suggestions for improvements, please open an issue or pull request on GitHub.

## License

This contract is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to OpenZeppelin for providing the ERC721 and Ownable contracts used in this implementation.
