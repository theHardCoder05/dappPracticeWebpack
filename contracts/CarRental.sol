// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
import './IRental.sol';

contract CarRental is ICar {
    // owner of the smart contract
    address public owner;

    // Enum status for car 
    enum State {ForRent, UnderMaintenance }

    // Enum status for car 
    enum RentalState {Vacant, Occuppied }

    // Constant values
    uint constant Duration = 14;
    // Cars records
    mapping(uint => Car) Cars;
    // Rental records
    mapping(address => Car) Rentals;
    // events for car rental
    event LogForRent(uint id);

    // event log for Occuppied
    event LogForOccuppied(uint id);

    // event Car rental contract created
    event LogForCreated(address add);
  
 
    // Car Struct
    struct Car {
        uint uid;
        string name;
        uint price;
        State state;
        uint year;
       
    }

    // Rental Struct
    struct Rental {
        uint datetime;
        address payable renter;
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


    // public constructor
    constructor() public  {
        owner = msg.sender;
        emit LogForCreated(address(this));
    }

    

   // add new car 
   // uid should pass in from external instead of generate in the SC. Perhaps, this should use Oraclelisation
function addNewCar(string calldata _carName, uint _price, uint _uid, uint _year) external returns(bool){
     
     Cars[_uid] = Car({
     name: _carName, 
     price: _price, 
     uid: _uid,
     state: State.ForRent, 
     year: _year
    
    
    });
    
    emit LogForRent(_uid);
    return true;
}


function fetchCar(uint _uid) external view 
     returns (uint Uid, string memory carName, uint price, uint state, uint year) 
   { 
    carName = Cars[_uid].name; 
    Uid =  Cars[_uid].uid; 
    price  = Cars[_uid].price; 
    state = uint(Cars[_uid].state); 
    year  = Cars[_uid].year; 

  
     return (Uid, carName, price, state, year); 
  } 

}