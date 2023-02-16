import web3 from "./web3";
import Web3 from "web3";
import MarketFactory from "./build/MarketFactory.json";

const instance = new web3.eth.Contract(
  MarketFactory.abi,
  "0xfcAEeC326A8fB329ce5E80Ce0DC3150EdeA9a290" // deployed contract "MarketFactory" address
);

export default instance;
