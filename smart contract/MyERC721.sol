pragma solidity ^0.8.0;

import "@imtbl/zkevm-contracts/contracts/token/erc721/preset/ImmutableERC721.sol";

contract MyERC721 is ImmutableERC721 {
  constructor(
    address owner,
    string memory name,
    string memory symbol,
    string memory baseURI,
    string memory contractURI,
    address operatorAllowlist,
    address receiver,
    uint96 feeNumerator
  )
    ImmutableERC721(
      owner,
      name,
      symbol,
      baseURI,
      contractURI,
      operatorAllowlist,
      receiver,
      feeNumerator
    )
  {}

  uint256 maxTopScoresList = 10;

  struct User {
    address walletAddress;
    string email;
    uint256 points;
  }

  struct TopScore {
    string email;
    uint256 points;
  }

  mapping(address => User) public users;

  TopScore [10] public topscoreArray;

  function addUser(
    address walletAddress,
    string memory email,
    uint256 points)  external payable {
      users[walletAddress] = User(
        walletAddress,
        email,
        points
      );
  }

  function showTopScore() public view returns (TopScore [] memory) {
    TopScore[] memory topScores = new TopScore[](topscoreArray.length);
    for (uint i = 0; i < topscoreArray.length; i++) {
        topScores[i] = topscoreArray[i];
    }
    return topScores;
  }

  function addTopScore(address walletAddress, string memory email, uint256 amount) external payable {
    users[walletAddress].points += amount;

    uint256 i = 0;
    /** get the index of the current max element **/
    for(i; i < topscoreArray.length; i++) {
        if(topscoreArray[i].points < amount) {
            break;
        }
    }
    /** shift the array of position (getting rid of the last element) **/
    for(uint j = topscoreArray.length - 1; j > i; j--) {
        topscoreArray[j].points = topscoreArray[j - 1].points;
        topscoreArray[j].email = topscoreArray[j - 1].email;
    }
    /** update the new max element **/
    topscoreArray[i].points = amount;
    topscoreArray[i].email = email;
  }

  function checkUserExists(address walletAddress) public view returns (bool) {
        return address(users[walletAddress].walletAddress) == walletAddress;
  }

  function showPoints(address walletAddress) external view returns (uint256) {
    return users[walletAddress].points;
  }

  function redeemNFT(address walletAddress, uint256 nftPoints, uint256 points) external payable {
    require(users[walletAddress].points >= nftPoints, "Insufficient Amount Of Points");

    users[walletAddress].points -= points;
  }
}