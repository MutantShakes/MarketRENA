const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/MarketFactory.json");

const provider = new HDWalletProvider(
  "wolf ill receive orange leisure dash language blood glance step injury exotic", // Mnemocin here
  "https://goerli.infura.io/v3/6daee45f958b4a4ba25dd391d48358ed" // infura API
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[1]);

  try {
    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ gas: "3000000", from: accounts[1] });

    console.log("Contract deployed to", result.options.address);
  } catch (err) {
    console.log("ERROR:", err.message);
  }
  provider.engine.stop();
};
deploy();
