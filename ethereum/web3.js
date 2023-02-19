import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask

  const provider = new Web3.providers.HttpProvider(
    "https://goerli.infura.io/v3/6daee45f958b4a4ba25dd391d48358ed" //INFURA API
  );
  web3 = new Web3(provider);
}

export default web3;
