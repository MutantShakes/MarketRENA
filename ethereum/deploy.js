const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/MarketFactory.json");

const provider = new HDWalletProvider(
  "", // Mnemocin here
  "" // infura API
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[1]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1400000", from: accounts[1] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
