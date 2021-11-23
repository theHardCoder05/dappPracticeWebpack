# Final project - Decntralised Cars Renting Platform

## Deployed version url:

https://thehardcoder05.github.io/dappPracticeWebpack/

## How to run this project locally:

### Prerequisites

- Node.js 
- Truffle and Ganache
- NPM
- `git checkout master`

### Contracts

- Run `npm install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `8545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `truffle test`
- `development` network id is 1337, remember to change it in Metamask as well!

### Frontend

- `cd client`
- To install the dependecies - `npm install`
- To build artifacts - `npm run build`
- To run the app - `npm run dev`
- Open `http://localhost:8080`


## Screencast link




## Public Ethereum wallet for certification:

`0xA7D88AB5987b7837d9C6aE2A07f5df4575a502EB`

## Description

User and apartment owner enter an agreement for renting a property, i.e. exchanging usage rights to an apartment for as long as payments are made to a specific Ethereum account before the agreed deadline.

User receives a keycode / access token to the apartment after first payment. If a user's payments are late, they will receive a reminder after one week. After e.g. 30 days (variable depending on local jurisdiction) of no payments, usage rights will be automatically transferred back to owner and apartment access rights will be revoked from user. User agrees to this procedure when entering contract with owner.

- Checking for received payments and transferring ownership back to owner on non-payment cases could be scheduled with e.g. Gelato Network (https://docs.gelato.network/tutorial).
- Opening door locks could be done with an app with smart locks, e.g. https://api.getkisi.com/docs. Smart lock APIs won't be explored in this project.

## Workflow
### Booking workflow
1. Navigate to the Application URL
2. MetaMask prompts to user for login
3. Ensure your MetaMask's address(0x0) showing in the Driver's address field approriately.
4. Entering your Personal Information such as Full name and Driving License Id - The Driving Identify Id will be stored as hash value for GDPR compliance. (In the LIVE production version this information should handle by legitimate KYC process).
5. Enter the desire days to rent with the exact deposit amount.
6. Hit "Book Me" button in a few minutes later you shall receive SMS or email regarding the booking confirmation(In phase 3). To inform about collecting the car key.
7. Enjoy your ride!!!!

### Withdraw workflow
1. Agent to withdraw or refund back the Driver if and only if the Driver didn't violate traffic rules or met any accident.
2. The Withdraw amount should be the 70% of the total amount of the deposit; 30% is the renting fee charge. 
3. Greets to the Driver and see you soon!!


## Functions to be implemented(In next phases)

1. 


## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Sensitive Information

- .key file - Infura Gateway's Project Id
- .secret - MetaMask Mnemonic key


