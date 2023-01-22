import web3 from "./web3";
import MarketFactory from "./build/MarketFactory.json";

const instance = new web3.eth.Contract(
  MarketFactory.abi,
  "" // contract "MarketFactory" address
);

export default instance;
