import web3 from "./web3";
import LabourMarket from "./build/LabourMarket.json";

const LabourMarkets = (address) => {
  return new web3.eth.Contract(LabourMarket.abi, address);
};

export default LabourMarkets;
