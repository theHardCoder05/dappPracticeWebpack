// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
import './IRental.sol';

contract CarRental is IRental {
    address public owner;
    // Enum status for car rental
    enum State {ForRent, Occuppied, UnderMaintenance }
    // Constant values
    uint constant Duration = 14;
    // Cars records
    mapping(uint => Car) Cars;

    // events for car rental
    event LogForRent(uint id);

    // event log for Occuppied
    event LogForOccuppied(uint id);

    // event Car rental contract created
    event LogForCreated(address add);
  
 
    // Car Struct
    struct Car {
        string name;
        uint deposit;
        uint uid;
        State state;
        address payable renter;
        address payable owner;
        uint duration;
    }

    // Only Owner
    modifier isOwner (address _address) { 
        require (msg.sender == _address); 
        _;
    }
    // modifier to check paidEnough
      modifier paidEnough(uint _fee) { 
        require(msg.value >= _fee); 
        _;
    }

    //todo: Ensure the rental duration not exceed the set limit
 


    // public constructor
    constructor() public  {
        owner = msg.sender;
        emit LogForCreated(address(this));
    }

    

   // add new car 
   // uid should pass in from external instead of generate in the SC. Perhaps, this should use Oraclelisation
function addNewCar(string calldata _carName, uint _deposit, uint _uid) external returns(bool){
    Cars[_uid] = Car({
     name: _carName, 
     deposit: _deposit, 
     uid: _uid,
     state: State.ForRent, 
     owner: msg.sender, 
     renter: address(0),
     duration: Duration
    
    });
    
    emit LogForRent(_uid);
    return true;
}

function fetchCar(uint _uid) external view 
     returns (string memory carName, uint deposit, uint state) 
   { 
    carName = Cars[_uid].name; 
    deposit  = Cars[_uid].deposit; 
    state = uint(Cars[_uid].state); 
  
     return (carName, deposit, state); 
  } 

}