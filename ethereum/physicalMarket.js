import web3 from "./web3";
import PhysicalMarket from "./build/PhysicalMarket.json";

const PhysicalMarkets = (address) => {
  return new web3.eth.Contract(PhysicalMarket.abi, address);
};

export default PhysicalMarkets;
