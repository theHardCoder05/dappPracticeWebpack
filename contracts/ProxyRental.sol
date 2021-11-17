// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
import './ICar.sol';
import './IRental.sol';
import './Ownable.sol';
import './CarRental.sol';

contract ProxyRental   {
   
    address public sender;
    address public Owner;
    constructor() public {
       
    }
    
    
    function fetchContractsByProxy(address _base) external returns(address[] memory)  {
        sender = msg.sender;
        (bool status, bytes memory returnData) = _base.call(abi.encodeWithSignature("fetchRentals()"));
        require(status,"Failed to retrieve rentals");
        return abi.decode(returnData, (address[]));
      
        
    }
   
}