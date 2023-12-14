# FRUIT CRUSH GAME FOR IMMUTABLE X STACKUP BOUNTY
For this bounty, I have developed a game application inspired by **Candy Crush**. The game I created is based on **React** and seamlessly integrated with **Immutable Passport** and a smart contract. The smart contract I have developed is based on the **ImmutableERC721** preset from the **zkevm-boilerplate**, to which I have added additional functions. Additionally, I have deployed the smart contract using the **zkevm-boilerplate**.

https://nashki-fruit-crush.netlify.app/

# Playing Fruit Crush

![Image1](https://imageupload.io/ib/uCE7GKdhnKDYa1w_1698641705.png)

When a player opens the **Fruit Crush** page, they will be prompted to connect their wallet (in this case, using **Immutable Passport**) with the **Fruit Crush** app. To establish this connection, they can simply click the "Connect Passport" button located at the top-right corner of the page. If a player is not yet registered within the app, their data, including Passport wallet address, email, and points, will be automatically registered in the smart contract. I achieve this by:

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


Here, I have chosen to input the email obtained from the player's Passport since I have not yet found a way to change the user's nickname in Passport, thus ensuring that the value is not `NULL`. Once the connection is established, the player will be redirected to the game page as follows:

![image2](https://imageupload.io/ib/JQB5t9vh3H9frD7_1698642326.png)

On the game page, there are three rows of elements from left to right. Starting from the leftmost, there's the Leaderboard table. In the middle section, you'll find the **Fruit Crush** game, and on the rightmost side, there is a table containing information on Score, Time Left, Start Game, Buy Lightning, and Add to My Points.

 ### Leaderboard
The Leaderboard table displays the top 10 highest scores achieved by players. In this context, I store the top scores in the smart contract using the following method:

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


### Fruit Crush Game
Similar to **Candy Crush**, here players aim to achieve the highest score within a predetermined time frame (60 seconds). The gameplay involves sliding fruits one step vertically or horizontally. Players can only slide fruits that have the potential to form a minimum of 3 identical fruits (more identical fruits result in a higher score). If a fruit cannot potentially generate a score, it cannot be slid. Scoring in the game is as follows:

 ##### Combining 3 identical fruits
The score awarded to the player is 3 points per combination.
	
 ##### Combining 4 identical fruits
The score awarded to the player is 4 points per combination.
	
 ##### Combining 5 identical fruits
The player earns 5 points per combination, and they will also receive a power-up, which is the Lightning.
	
 ##### Lightning
The Lightning can be combined with any fruit and will cause all the fruits on the board to disappear, generating 2 points for each fruit removed.

 ##### Double Lightning
This is the highest-scoring combination, achieved by combining 2 Lightning power-ups. This combination will clear all the fruits on the board, and the player will earn 3 points for each fruits removed.

 ### Score
This is the player's score display for a single game.

### Time Left
The "Time Left" indicator shows how much time is remaining in the game.

### Start Game
The "Start Game" button is used to initiate the game. Each game round lasts for 60 seconds.

### Buy Lightning
The "Buy Lightning" button allows players to purchase the Lightning power-up, which will appear randomly on the game board. The cost for one Lightning power-up is 0.001 IMX, and the payment is directly transferred to the wallet owner of **Fruit Crush**. I employ the Passport RPC method `eth_sendTransaction` for this transaction.

### Add to My Points
This is the button to add the score to the points owned by the player by submitting the player's points to be recorded in the smart contract. I accomplish this using the same function used to add top scores, as seen in the Leaderboard section.

![image3](https://imageupload.io/ib/U7r7VIR9WERH8V8_1698643275.png)

If the points that the player has submitted to the smart contract are sufficient, they can exchange one of the NFTs available on the redeem page with the accumulated points. It can be observed that Medal NFT 1 and Medal NFT 3 are still claimable (yet to be claimed by anyone), while Medal NFT 2 has already been claimed by the wallet address listed. Here, I utilize the `mintNFT` function to send the NFT to the player's wallet, ensuring that each NFT can only be owned by one player.

![image4](https://imageupload.io/ib/GDccueia6xSuy2a_1698643365.png)

Finally, this is the player's profile page, displaying various data such as wallet address, email, wallet balance, points, and the collection of successfully claimed NFTs.

I apologize for the use of English and for the write-up I have provided; please understand that I am not very descriptive by nature. I have put in a lot of effort to complete this bounty. Thank you to **Immutable** and **StackUp** for organizing this bounty.
