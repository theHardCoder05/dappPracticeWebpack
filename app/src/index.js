import Web3 from "web3";
import carRentalArtifact from "../../build/contracts/carRental.json";

const App = {
  web3: null,
  account: null,
  carRetal: null,

  start: async function() {
    const { web3 } = this;

    try {
      
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = carRentalArtifact.networks[networkId];
      this.carRetal = new web3.eth.Contract(
        carRentalArtifact.abi,
        deployedNetwork.address,
      );
      console.log("This is the deployed Smart Contract address - {0}", deployedNetwork.address);

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      const sender = document.getElementById("sender");
      sender.value = this.account;
      const balance = await web3.eth.getBalance(deployedNetwork.address);
      console.log(web3.utils.fromWei(balance.toString(), 'ether'));
      const currentbalance = document.getElementById("currentdeposit");
      currentbalance.value = balance;
      //this.refreshBalance();
      // this.monitorAccount();
      this.getEtherPrice();
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

  getEtherPrice: async () => {
    const price = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
    const result = await price.json();
    console.log(result.data['amount']);
    const depositHelp = document.getElementById("pricerate");
    depositHelp.outerText = "The current rate is : " + result.data['amount'];
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  // Rent Car function 
  // Convert date to Epoch 
  rentCar: async () => {
    const carId = document.getElementById("carId").value.trim();

    const driverName = document.getElementById("dname").value.trim();
    const rentDate = Math.round(new Date(document.getElementById("rentdate").value).getTime() / 1000.0);
    const deposit = document.getElementById("depositamount").value;
  
    if (carId == "") {
      alert('Please pick a car');
    } 
    if (driverName == "") {
      alert('Driver name cannot be blank');
    } 
    if (deposit == "") {
      alert('Deposit cannot be blank');
    } 

    // If everything is okay then rent!!!
  },
  
  // reset the form values
  reset: async () => {
    document.getElementById("carId").value = "";
    document.getElementById("dname").value = "";
    document.getElementById("depositamount").value = "";
  }
};



window.App = App;

window.addEventListener("load", function() {
 

  if (window.ethereum) {
    const sender = document.getElementById("sender");

    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    window.ethereum.on('accountsChanged', function (accounts) {

      sender.value = accounts[0];
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


  App.start();
});




