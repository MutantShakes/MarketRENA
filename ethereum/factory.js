import web3 from "./web3";
import Web3 from "web3";
import MarketFactory from "./build/MarketFactory.json";
import factoryAddress from "./factoryAddress";

const instance = new web3.eth.Contract(
  MarketFactory.abi,
  factoryAddress // deployed contract "MarketFactory" address
);

export default instance;
