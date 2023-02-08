import web3 from "./web3";
import Web3 from "web3";
import MarketFactory from "./build/MarketFactory.json";

const instance = new web3.eth.Contract(
  MarketFactory.abi,
  "0x479444C66a5fA9AC77E9FbD19620aE62a3a9bD52" // deployed contract "MarketFactory" address
);

export default instance;
