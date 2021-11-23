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
6. Hit "Book Me" button in a few minutes later you shall receive SMS or email regarding the booking confirmation(In phase 3).
7. 
## Scheduled workflow for late payments (Not implemented)

1. Run scheduled contract weekly (Gelato? https://docs.gelato.network/tutorial)
2. Check for made payments for each rental agreement (from renter wallet to owner wallet)
3. If last payment is late 7 days, send reminder
4. If last payment is late >= 30 days, remove tenant. Revoke user token access rights to apartment smart lock.

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Tenant payments tracking
- Tenant removal
- Fund withdrawal
