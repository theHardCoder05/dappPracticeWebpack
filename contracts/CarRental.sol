// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
import './ICar.sol';
import './IRental.sol';
contract CarRental is ICar, IRental {
    // owner of the smart contract
    address public owner;

    // Enum status for car 
    enum State {ForRent, Rented, UnderMaintenance }

    // Enum status for car 
    enum RentalState {Vacant, Occuppied }

    uint Total;
    // rental_id 
    uint rentalId;
    // Constant values - 2 weeks
    uint constant Duration = 14;
    // Cars records
    mapping(uint => Car) public Cars;
    // Rental records
    mapping(address => Rental) public Rentals;
    // events for car rental
    event LogForRent(uint id);

    // event log for Occuppied
    event LogForOccuppied(uint id);

    // event Car rental contract created
    event LogForCreated(address add);
  
    // event log for Rental
    event LogRentCar(uint rentalId);

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
        uint id;
        uint datetime;
        address payable renter;
        uint duration;
        uint receivedAmount;
        uint cid;
    }

    // Only Owner
    modifier isOwner { 
        require (msg.sender == owner); 
        _;
    }
    // modifier to check paidEnough
      modifier paidEnough(uint _deposit) { 
        require(msg.value >= _deposit, "Insufficient fund"); 
        _;
    }


    // public constructor
    constructor() public  {
        owner = msg.sender;
        rentalId = 0;
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

// Fetch car by uid
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


// Rent car function with uid and renter's address
// datetime pass-in from external not to use timestamp in Solidity to avoid timestamp hacks.
// Modifier, who can pay the deposit?
// Is msg.value sufficient?
function rentCar(uint _uid, address payable  _renter, uint _datetime) external payable paidEnough(Cars[_uid].price)  returns(bool) {
    uint256 amount = msg.value;
    Rentals[_renter] = Rental({
    id: rentalId,
    datetime: _datetime,
    duration: Duration,
    receivedAmount:amount,
    renter: _renter,
    cid:_uid
    });

    rentalId = rentalId + 1;
    Cars[_uid].state = State.Rented;
    emit LogRentCar(rentalId);
    return true;
    
}

// Withdraw back the deposit to renter
function withdraw(address payable renter) external isOwner returns (bool){
    return true;
}


function fetchRental(address payable _renter) external view  returns(uint rid, uint datetime, uint duration, uint receivedAmount,address payable renter, uint cid) {

        rid = Rentals[_renter].id; 
        datetime = Rentals[_renter].datetime;
        duration = Rentals[_renter].duration;
        receivedAmount = Rentals[_renter].receivedAmount;
        renter = Rentals[_renter].renter;
        cid = Rentals[_renter].cid;  


return (rid, datetime, duration, receivedAmount, renter,cid); 
}

}




