import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from './utils/Vault.json';
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  /*
   * All state property to store all waves
   */
  const contractAddress = "0xdEF298dCB84CBFD0eb1931A507B2a70fE5e3D198";

  const contractABI = abi.abi;

  const [msg, setMsg] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await wave();
    console.log(res);
  }

  const handleWithdraw = async (event) => {
    event.preventDefault();

    const res = await withdraw();
    console.log(res);
  }

  const withdraw = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const amt = ethers.utils.parseEther(msg);
        
        const lendContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waveTxn = await lendContract.withdraw(amt.toString(), {value: amt, gasLimit: 30000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const amt = ethers.utils.parseEther(msg);
        
        console.log(amt.toString());
        const lendContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("!!" + msg);
        const waveTxn = await lendContract.deposit(amt.toString(), {value: amt, gasLimit: 30000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="kitty">😺</span> Simple Loan dApp <span role="img" aria-label="kitty">😺</span>
        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <br/>

        <form onSubmit={handleSubmit}>
          <label>Enter amount of ETH (in wei) to deposit:
            <input
              type="number" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              step="any"
            />
          </label>
          <input type="submit" />
        </form>

        <br/>

        <form onSubmit={handleWithdraw}>
          <label> Withdraw deposit
            <input
              type="number" 
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              step="any"
            />
          </label>
          <input type="submit" />
        </form>

        {/* <button className="waveButton" onClick={handleWithdraw}>
            Withdraw deposit
        </button> */}


        {/*
        * If there is no currentAccount render this button
        */}

        {/* {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })} */}

      </div>
    </div>
  );
}



export default App

