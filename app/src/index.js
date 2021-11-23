import Web3 from "web3";
import carRentalArtifact from "../../build/contracts/carRental.json";
import OchestratorArtifact from "../../build/contracts/Ochestrator.json";
const App = {
  web3: null,
  account: null,
  carSC: null,
  Ochestrator:null,

  start: async function() {
    const { web3 } = this;

    try {



    
      
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = carRentalArtifact.networks[networkId];
      this.carSC = new web3.eth.Contract(
        carRentalArtifact.abi,
        deployedNetwork && deployedNetwork.address,
        //'0x4590b1A0600EAE82950a2fbBC9Bf8756aF7B4251',
      );
      console.log("This is the deployed Smart Contract address - {0}", deployedNetwork.address);

      // Ochestrator Contract
      const deployedNetworkProxy = OchestratorArtifact.networks[networkId];
      this.Ochestrator = new web3.eth.Contract(
        OchestratorArtifact.abi,
        deployedNetwork && deployedNetwork.address,
        //'0xe36E57D865172F6E88E81081f22F1642020aFb78',
      );
      console.log("This is the deployed Proxy Smart Contract address - {0}", deployedNetworkProxy.address);
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      const driver = document.getElementById("driver");
      driver.value = this.account;
   
      const agent = document.getElementById("agent");
      agent.value = this.carSC._address;
      this.getEtherPrice();
      this.getAddresses();

      
      setInterval(getPrice, 1000);
        
         
        const depositHelp = document.getElementById("pricerate");
        async function getPrice()
        {
          const price = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
          const result = await price.json();
         
          depositHelp.innerHTML = "The current rate is : " + result.data['amount'];

          const balance = await web3.eth.getBalance(deployedNetwork.address);

          const currentbalance = document.getElementById("currentdeposit");
          currentbalance.value = Web3.utils.fromWei(balance, 'ether')

         
        }

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },



  // Get all rentals from Smart Contract
  getAllRentals: async (address) => {
    const { Rentals } = App.carSC.methods;
    const rentals = await Rentals(address).call();
    console.log(rentals);
    return rentals;
  },

  getAccount: async function() {
    const accounts = await ethereum.enable();
    const account = accounts[0];
    console.log(account);
  },

  hashFunction: async function(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "0x" + hashHex;
},
  getEtherPrice: async () => {
    const price = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
    const result = await price.json();
    console.log(result.data['amount']);
    const depositHelp = document.getElementById("pricerate");
    depositHelp.outerText = "1 Ether to USD  : $" + result.data['amount'];
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  // Rent Car function 
  // Convert date to Epoch 
  // Masked and hashed the driving license id for security purpose
  rentCar: async () => {

    const carId = document.getElementById("carId").value.trim();
    const driverName = document.getElementById("dname").value.trim();
    const rentDate = Math.round(new Date(document.getElementById("rentdate").value).getTime() / 1000.0);
    const deposit = document.getElementById("depositamount").value;
    const drivername = document.getElementById("dname").value;
    const drivinglicenseid = document.getElementById("dlilcenseid").value;
    
    if (carId == "") {
      alert('Please pick a car');
      return false;
    } 
    if (driverName == "") {
      alert('Driver name cannot be blank');
      return false;
    } 
    // if (deposit == "") {
    //   alert('Deposit cannot be blank');
    //   return false;
    // } 
    if (drivinglicenseid == "") {
      alert('Driving License Id cannot be blank');
      return false;
    } 

    // If everything is okay then rent!!!

    console.log(App.account);
    console.log(deposit);
    const weiValue = Web3.utils.toWei(deposit, 'ether');
    const { rentCar } = App.carSC.methods;
    const bytes32DrivingLicenseId = await App.hashFunction(drivinglicenseid);

    await rentCar(carId, drivername, bytes32DrivingLicenseId, rentDate).send({ from: App.account, to: App.carSC._address, value: weiValue })
    .on('transactionHash', (hash) => alert('Transaction Hash: ' + hash) );
  
    window.location.reload();

  },


// Date function - To compare dates 
 setPrice: async () => {
  const toDate = new Date(document.getElementById("rentdate").value);
  const today = new Date();
  const diffTime = Math.abs(toDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const totalEther = diffDays * 0.001;
  const price = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy');
  const result = await price.json();
  document.getElementById("depositamount").value = totalEther;
  document.getElementById("priceinusd").value = Math.round(totalEther * result.data['amount']);
 },

  // Withdraw fund to driver
  withdraw: async () => {
    const driveraddress = document.getElementById("daddress").value.trim();
    if (driveraddress == "") {
      alert("Driver's MetaMask Address cannot be blank");
      return false;
    } 

    const { withdraw } = App.carSC.methods;
    await withdraw(driveraddress).send({ from: App.account}).on('transactionHash', (hash) => alert('Transaction Hash: ' + hash) );
    window.location.reload();
  },

  // Addresses data binding
  getAddresses: async () => {
    const { fetchRentals } = App.carSC.methods;
    const drivers = await fetchRentals().call();
    const driversList = document.getElementById("drivers");
    for (let i = 0; i < drivers[1]; i++){
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = drivers[0][i];
      driversList.appendChild(opt);
    }

  },
  
  // reset the form values
  reset: async () => {
    document.getElementById("carId").value = "";
    document.getElementById("dname").value = "";
    document.getElementById("dlilcenseid").value = "";
   
  }
};



window.App = App;

window.addEventListener("load", function() {
 

  if (window.ethereum) {
    const driver = document.getElementById("driver");
 
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    window.ethereum.on('accountsChanged', function (accounts) {

      driver.value = accounts[0];
      window.location.reload();
     });
 
  } else {
        alert('No MetaMask!!!!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }


  App.start();
});




