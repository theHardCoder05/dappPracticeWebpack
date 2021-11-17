var CarRental = artifacts.require('./CarRental.sol');
var proxyRental = artifacts.require('./ProxyRental.sol');
module.exports = function(deployer) {
  deployer.deploy(CarRental);
  deployer.deploy(proxyRental);
    
  };
  