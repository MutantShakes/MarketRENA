# MarketRENA

Setup:
(Skip Deployment if you want to work with deployed smart contract)

1. deploy.js setup:
   Enter your mnemonic and infura api in the designated section.

2. app.js setup:
   Enter you livepeer API and infura API in the designated section.

3. Deployment:
   From root directory,
   cd ehtereum
   node compile.js
   node deploy.js

4. factory address setup:
   open factoryAddress.js and paste the address recieved in console.log from node deploy.js

5. Start the Website
   From root directory
   npm run dev.
