import "./App.css";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers, Signer, Wallet, getDefaultProvider } from "ethers";
import { config, passport } from "@imtbl/sdk";
import { ERC721Client, ERC721MintByIDClient } from "@imtbl/zkevm-contracts";
import Game from "./pages/game";
import Profile from "./pages/Profile";
import Redeem from "./pages/Redeem";
import MyERC721 from "./MyERC721.json";

function App() {
  const passportClientId = process.env.REACT_APP_CLIENT_ID;
  const scAddress = process.env.REACT_APP_SC_ADDRESS;
  const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [points, setPoints] = useState();
  const [defaultAccount, setDefaultAccount] = useState("");
  const [contract, setContract] = useState();
  const [passportProviders, setPassportProviders] = useState();
  const [email, setEmail] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const params = new URLSearchParams(document.location.search);
  const navigate = useNavigate();

  const passportInstance = new passport.Passport({
    baseConfig: new config.ImmutableConfiguration({
      environment: config.Environment.SANDBOX,
    }),
    clientId:  passportClientId,
    redirectUri: 'https://nashki-fruit-crush.netlify.app',
    logoutRedirectUri: 'https://nashki-fruit-crush.netlify.app',
    logoutMode: 'redirect',
    audience: 'platform_api',
    scope: 'openid offline_access email transact'
  });

  const connect = async () => {
    try {
      if (!isLogin) {
        // authenticate user
        setIsLoading(true);
        const passportProviders = passportInstance.connectEvm();
        const providers = new ethers.providers.Web3Provider(passportProviders);
        const accounts = await passportProviders.request({ method: "eth_requestAccounts" });
        const signer = providers.getSigner();
        const userProfile = await passportInstance.getUserInfo();
        const contractInstance = new ethers.Contract(scAddress, MyERC721, signer);
        const accountString = accounts[0].toString();
        const wallet = await contractInstance.checkUserExists(accountString);
        const accountPoints = await contractInstance.showPoints(accountString);

        const balance =  parseInt(await passportProviders.request({
          method: 'eth_getBalance',
          params: [accountString, 'latest']
        }));

        const balanceToString = ethers.utils.formatEther(balance.toString());

        if (!wallet) {
          try{
            await contractInstance.addUser(accountString, userProfile.email, 0, {gasLimit: 2_000_000});
            alert(`Welcome ${userProfile.email}`);
          } catch (e) {
            console.log(e);
          }
        } else {
          alert(`Welcome ${userProfile.email}`);
        }

        setPoints(parseInt(accountPoints / 1000000000000000000));
        setContract(contractInstance);
        setPassportProviders(passportProviders);
        setIsLogin(true);
        setDefaultAccount(accountString);
        setEmail(userProfile.email);
        setWalletBalance(Number(balanceToString).toPrecision(4));
        setIsLoading(false);
        navigateToGame();
      } else { 
        // Log the user out
        await passportInstance.logout();
        setIsLogin(false);
        setDefaultAccount("");
      } 
    } catch (e) {
      console.log(e);
    }
  };

  const redeemNFT = async (token_id, NFTPoints) => {
    try {
        await contract.redeemNFT(defaultAccount, NFTPoints, ethers.utils.parseEther(NFTPoints.toString()), {gasLimit: 2_000_000});

        await grantMinterRole();

        await mintNFT(token_id);

        const newPoints = await contract.showPoints(defaultAccount);
        setPoints(parseInt(newPoints / 1000000000000000000));
    } catch (e) {
        console.log(e);
    }
  };

  const grantMinterRole = async () => {
    try {
      const provider = getDefaultProvider("https://rpc.testnet.immutable.com");
      const wallet = new Wallet(PRIVATE_KEY, provider);
      const contractInstance = new ERC721Client(scAddress);

      const populatedTransaction = await contractInstance.populateGrantMinterRole(
        wallet.address
      );
      await wallet.sendTransaction(populatedTransaction);
      console.log("Minter Role Granted");
    } catch (e) {
      console.log(e);
    }
  };

  const mintNFT = async (token_id) => {
    try {
      const provider = getDefaultProvider("https://rpc.testnet.immutable.com");
      const wallet = new Wallet(PRIVATE_KEY, provider);
      const contractInstance = new ERC721MintByIDClient(scAddress);

      const minterRole = await contractInstance.MINTER_ROLE(provider);
      const hasMinterRole = await contractInstance.hasRole(
        provider,
        minterRole,
        wallet.address
      );

      if (!hasMinterRole) {
        console.log("Account doesnt have permissions to mint.");
      }

      const populatedTransaction = await contractInstance.populateMint(defaultAccount, token_id);
      await wallet.sendTransaction(populatedTransaction);
      alert("Successful Minting NFT To Your Wallet!");
    } catch (e) {
      console.log(e);
    }
  };

  const navigateToGame = () => {
    navigate("/game");
  };

  useEffect(() => {
    if (params.get("code")) {
      try {
        passportInstance.loginCallback();
      } catch (e) {
        console.log(e);
      }
    }

  }, [defaultAccount, points, contract]);

  return (
    <>
      <nav>
        <ul className="nav backdrop-blur-sm bg-white/60">
          {isLogin ? (
            <>
              <NavLink to="/game" className="nav-item">
                Game
              </NavLink>
              <NavLink to="/redeem" className="nav-item">
                Redeem Rewards
              </NavLink>
              <NavLink to="/profile" className="nav-item">
                Profile
              </NavLink>
            </>
          ) : (
            <></>
          )}
          <div className="acc-container">
            {defaultAccount && <p className="acc-score">{email} | Balance: {walletBalance} IMX | Points: {points}</p>}
            <div className="connect-btn">
              <button onClick={connect} disabled={isLoading} className="primary-btn">
                {isLogin
                  ? "Logout"
                  : "Connect Passport"}
              </button>
            </div>
          </div>
        </ul>
      </nav>

      {!isLogin ? <div class="text-5xl font-bold center">Connect Your Wallet First</div> : <></> }

      <Routes>
        {isLogin ? (
          <>
            <Route path="/game" element={<Game myContract={contract} address={defaultAccount} passportProviders={passportProviders} setWalletBalance={setWalletBalance} email={email} setPoints={setPoints}/>} />
            <Route path="/redeem" element={<Redeem redeemNFT={redeemNFT} scAddress={scAddress}/>} />
            <Route path="/profile" element={<Profile address={defaultAccount} email={email} points={points} walletBalance={walletBalance}/>} />
          </>
        ) : (
          <></>
        )}
      </Routes>
    </>
  );
}

export default App;
