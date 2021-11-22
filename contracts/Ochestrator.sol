// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import './IRental.sol';
import './CarRental.sol';

/*
This contract act as an Ochestration layer or gateway to provide to UI or API Caller.
 */
contract Ochestrator is Ownable  {
    /*
    using Safe Math from Openzeppelin
     */
     using SafeMath for uint;
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
    @notice: Potentially, this could be a Ochestration layer to manipulate the data before calling the "addNewCar" function. To do this, we can keep the base class clean and neat.
     */
    function addNewCarUpgradeble(address _base, string memory carName, uint engineId) external onlyOwner() {
    _carId.increment();
    uint carId = _carId.current();
    uint finalAutoId = SafeMath.mul(carId,1);
    (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("addNewCar()",finalAutoId,  carName, engineId));
    require(status,"Failed to add a new car");
    emit LogAddNewCar(msg.sender, carId, carName, engineId);
        

    }
}