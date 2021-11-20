// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import './IRental.sol';
import './CarRental.sol';

/*
This contract act as an Ochestration layer or gateway to provide to UI or API Caller.
 */
contract Ochestrator   {
   
    address public sender;
    
    /*
    event log for fecthing rentals
     */
    event LogEventTrigger(address sender, string message);



    constructor()  {
       
    }
    
    /*
    @notice: Fetch Rentals from Proxy contract.
    @param: address(The proxy contract's address)
     */
    function fetchRentalsFromProxy(address _base) external returns(address[] memory)  {
        sender = msg.sender;
        (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("fetchRentals()"));
        require(status,"Failed to retrieve rentals");
        emit LogEventTrigger(msg.sender, "Fetch Rentals from Proxy Contract");
        return abi.decode(returnData, (address[]));
    }
   

    //TODO: Need to check whether can pass json data to Solidity functions?
    function addNewCarUpgradeble(address _base, string memory data) external returns (bool) {
    


    }
}