// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import './ICar.sol';
import './IRental.sol';
import './CarRental.sol';


contract ProxyRental   {
   
    address public sender;
   
    constructor()  {
       
    }
    
    
    function fetchContractsByProxy(address _base) external returns(address[] memory)  {
        sender = msg.sender;
        (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("fetchRentals()"));
        require(status,"Failed to retrieve rentals");
        return abi.decode(returnData, (address[]));
      
        
    }
   
}