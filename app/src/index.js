import Web3 from "web3";
import carRentalArtifact from "../../build/contracts/carRental.json";


const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = carRentalArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        carRentalArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    const { getBalance } = this.meta.methods;
    const balance = await getBalance(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
  },
  getAccount: async function() {
    const accounts = await ethereum.enable();
    const account = accounts[0];
    console.log(account);
  },
  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { sendCoin } = this.meta.methods;
    await sendCoin().send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  
};

window.App = App;

window.addEventListener("load", function() {
  
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    window.ethereum.on('accountsChanged', function (accounts) {
      getAccount();
    });
 
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }
  const sender = document.getElementById("sender");
  sender.value = App.web3.currentProvider.selectedAddress;

  App.start();
});



