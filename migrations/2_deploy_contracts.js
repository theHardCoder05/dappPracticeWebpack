var CarRental = artifacts.require('./CarRental.sol');
var Ochestrator = artifacts.require('./Ochestrator.sol');
module.exports = function(deployer) {
  deployer.deploy(CarRental);
  deployer.deploy(Ochestrator);
    
  };
  