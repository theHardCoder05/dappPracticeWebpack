// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './IRental.sol';
import './CarRental.sol';

/*
This contract act as an Ochestration layer or gateway to provide to UI or API Caller.
 */
contract Ochestrator is Ownable  {
   
    /*
    event log for fecthing rentals
     */
    event LogEventTrigger(address sender, string message);
    /*
    event log for add a new car
     */
    event LogAddNewCar(address sender, uint id, string name, uint engineId);
    /*
    Car auto id(Unique)
     */
    using Counters for Counters.Counter;
    Counters.Counter private _carId;

    constructor()  {
       
    }
    
    /*
    @notice: Fetch Rentals from Proxy contract.
    @param: address(The proxy contract's address)
     */
    function fetchRentalsFromProxy(address _base) external returns(address[] memory)  {
        (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("fetchRentals()"));
        require(status,"Failed to retrieve rentals");
        emit LogEventTrigger(msg.sender, "Fetch Rentals from Proxy Contract");
        return abi.decode(returnData, (address[]));
    }
   

    //TODO: Need to check whether can pass json data to Solidity functions?
    /*
    @notice: To demostrate the dependency injection pattern or Ochestration pattern.
     */
    function addNewCarUpgradeble(address _base, string memory carName, uint engineId) external onlyOwner() {
    _carId.increment();
    uint carId = _carId.current();
     (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("addNewCar()",carId,  carName, engineId));
        require(status,"Failed to add a new car");
        emit LogAddNewCar(msg.sender, carId, carName, engineId);
        

    }
}