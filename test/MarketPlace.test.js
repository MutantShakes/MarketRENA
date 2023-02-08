const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/MarketFactory.json");
const compiledLabourFactory = require("../ethereum/build/LabourMarket.json");
const compiledPhysicalFactory = require("../ethereum/build/PhysicalMarket.json");

let accounts;
let factory;
let labourAddress;
let physicalAddress;
let labourMarket;
let physicalMarket;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods.createLabourMarket().send({
    from: accounts[0],
    gas: "2000000",
  });

  await factory.methods.createPhysicalMarket().send({
    from: accounts[0],
    gas: "2000000",
  });

  [labourAddress] = await factory.methods.getDeployedLabourMarkets().call();
  [physicalAddress] = await factory.methods.getDeployedPhysicalMarkets().call();

  labourMarket = await new web3.eth.Contract(
    compiledLabourFactory.abi,
    labourAddress
  );
  physicalMarket = await new web3.eth.Contract(
    compiledPhysicalFactory.abi,
    physicalAddress
  );
});

describe("Market Place", () => {
  it("deploys a factory, labour market and physical market", () => {
    assert.ok(factory.options.address);
    assert.ok(labourMarket.options.address);
    assert.ok(physicalMarket.options.address);
  });

  it("makes caller Seller of labour market or physical market", async () => {
    const creatorLabour = await labourMarket.methods.seller().call();
    const creatorPhysical = await physicalMarket.methods.seller().call();

    assert.equal(accounts[0], creatorLabour);
    assert.equal(accounts[0], creatorPhysical);
  });

  it("lets Seller to create service in the labour market", async () => {
    await labourMarket.methods.createService("Plumbing Service", "1000").send({
      from: accounts[0],
      gas: "1000000",
    });

    const serviceType = await labourMarket.methods.serviceTypes(0).call();

    assert(serviceType);
  });
});
