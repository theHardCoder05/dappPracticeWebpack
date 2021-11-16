// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
import './ICar.sol';
import './IRental.sol';
import './Ownable.sol';
contract CarRental is ICar, IRental, Ownable {
    // owner of the smart contract
   

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

    // event log for withdraw
    event LogWithdraw(address render, uint deposit);
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
        string drivername;
        bytes32 drivinglicenseid;
        address payable renter;
        uint duration;
        uint deposit;
        uint cid;
        RentalState state;
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

    // Modifier to check the rental is refundable
    modifier IsRefundable(address renter) {
    require((Rentals[renter].renter != address(0)) && (Rentals[renter].state == RentalState.Occuppied), "Not refundable with error");
    
      _;
   }

    // Modifier to check if the driver's status booked, no double booking...
    modifier canBook(address renter) {
    require((Rentals[renter].state == RentalState.Vacant), "Double booking not allowed..");
    
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
function addNewCar(string calldata _carName, uint _price, uint _uid, uint _year) external onlyOwner()  returns(bool){
     
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
function rentCar(uint _uid,string calldata _drivername,bytes32 _drivinglicenseid, uint _datetime) external payable canBook(msg.sender)  returns(bool) {
    uint256 amount = msg.value;
    address payable _renter = msg.sender;
    Rentals[_renter] = Rental({
    id: rentalId,
    drivername: _drivername,
    drivinglicenseid: _drivinglicenseid,
    datetime: _datetime,
    duration: Duration,
    deposit:amount,
    renter: _renter,
    cid:_uid,
    state: RentalState.Occuppied
    });

    rentalId = rentalId + 1;
    Cars[_uid].state = State.Rented;
    emit LogRentCar(rentalId);
    return true;
    
}

// Withdraw back the deposit to renter
// Use to send() to get boolean status
// Use Require to ensure the withdraw is succesfully done
// Modifer to check is the driver's address is valid and refundable
function withdraw(address payable _renter) external payable onlyOwner() IsRefundable(Rentals[_renter].renter)  returns (bool){
   
    uint withdrawAmount = Rentals[_renter].deposit;
    Rentals[_renter].deposit = 0;
    bool result = _renter.send(withdrawAmount);
    require(result, "Withdraw failed");
    Rentals[_renter].state = RentalState.Vacant;
    emit LogWithdraw(_renter, withdrawAmount);
    return result;
}


function fetchRental(address payable _renter) external view  returns(uint rid, uint datetime, uint duration, uint deposit,address payable renter, uint cid, uint state) {

        rid = Rentals[_renter].id; 
        datetime = Rentals[_renter].datetime;
        duration = Rentals[_renter].duration;
        deposit = Rentals[_renter].deposit;
        renter = Rentals[_renter].renter;
        cid = Rentals[_renter].cid;  
        state = uint(Rentals[_renter].state);  


return (rid, datetime, duration, deposit, renter,cid,state); 
}

}




