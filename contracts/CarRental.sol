// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import './IRental.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
/**
The abstract of the Smart Contract is to achieve disintermidiation objective. Drivers keep thier deposit in crypto (eth) in the Escrow Smart Contract.
This project potentially involves multiple entities and authoritises for due-diligent process. Such as KYC.
 */
contract CarRental is IRental, Ownable, AccessControl {

    /*
    Use the Counter API to generate rental id.
     */
    using Counters for Counters.Counter;
    Counters.Counter private _rentalId;

    /*
    Define a withdrawer role in this contract
     */
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
   
    /*
    Array list to store all drivers
     */
    // https://ethereum.stackexchange.com/questions/62824/how-can-i-build-this-list-of-addresses
    address[] public Drivers;
    

    /*
    Enumeration of Rental contract's state to determine the contract status.
     */
    enum RentalState {Vacant, Occuppied }

    /*
    Auto generated ID - Potentially, could use ChainLink(Oracle).
     */
    uint rentalId;
    
    /*
    Constant value for Rental contract duration - 2 weeks - Pontentially for TimeLockedControl
     */
    uint constant Duration = 14;
   
    /*
    Rentals mapping to addresses
     */
    mapping(address => Rental) public Rentals;


    /*
    Event log for Car Rent
     */
    event LogForRent(uint id);

    /*
    Event log for Car Rent - Status change to Occuppied(Booked)
     */
    event LogForOccuppied(uint id);



    /*
    Event log for Rental contract created
     */
    event LogForCreated(address add);
  

    /*
    Event log for renting a car
     */
    event LogRentCar(uint rentalId);

    /*
    Event log for withdraw fund upon car returned
     */
    event LogWithdraw(address render, uint deposit);
 
     /*
      Rental Struct Object/Entity
     */
   
    struct Rental {
        uint id;
        uint datetime;
        string drivername;
        bytes32 drivinglicenseid;
        address payable driver;
        uint duration;
        uint deposit;
        uint cid;
        RentalState state;
    }

   
    /*
      Modifier to check whether the msg.value is sufficient to pay the deposit.
     */
      modifier paidEnough(uint _deposit) { 
        require(msg.value >= _deposit, "Insufficient fund to pay deposit"); 
        _;
    }

    /*
      Modifier to check whether the Driver's address whether is refundable.
     */
    modifier IsRefundable(address driver) {
    require((Rentals[driver].driver != address(0)) && (Rentals[driver].state == RentalState.Occuppied), "Not refundable with error");
    
      _;
   }

  /*
   Modifier - To prevent Owner itself to make a car booking. 
   */
   modifier isNotOwner(address driver){
       require(msg.sender != owner(), "Owner is not allowed for bookings");
       _;
   }

     /*
      Modifier to check whether the Driver double booking
     */
    modifier canBook(address driver) {
    require((Rentals[driver].state == RentalState.Vacant), "Double booking is not allowed..");
    
      _;
   }

    /*
      Constructor
      Give the withdrawer role to onwer.
     */
    constructor() {
        _setupRole(WITHDRAWER_ROLE,msg.sender);
        emit LogForCreated(address(this));
    }

    


/*
 @notice Car renting function 
 @ uid - Unique id of the vehicle (It can be registration number or RFID)
 @ driver name - Name of the driver. Calldata to optimise the gas.
 @ driving license id - Driving Identify of the driver, this information should be masked and hashed to compliance with GDPR.
 @ booking date - The exact booking date.
 @return - True if no errors.
 */
function rentCar(uint _uid,string calldata _drivername,bytes32 _drivinglicenseid, uint _datetime) external override payable canBook(msg.sender) isNotOwner(msg.sender)  returns(bool) {
    uint256 amount = msg.value;
    address payable driver = payable(msg.sender);
    Rentals[driver] = Rental({
    id: rentalId,
    drivername: _drivername,
    drivinglicenseid: _drivinglicenseid,
    datetime: _datetime,
    duration: Duration,
    deposit:amount,
    driver: driver,
    cid:_uid,
    state: RentalState.Occuppied
    });

    _rentalId.increment();
    rentalId = _rentalId.current();
    Drivers.push(driver);
    emit LogRentCar(rentalId);
    return true;
    
}


/*
 @notice Withdraw function
 To withdraw the correspondence fund to the particular driver based on the address.
 @ driver - The Driver
 Require to check if the msg.sender has the permission/ role to perform withdraw.
 Return  - True if no errors
 */
function withdraw(address payable driver) external override payable onlyOwner() IsRefundable(Rentals[driver].driver)  returns (bool){
    require(hasRole(WITHDRAWER_ROLE, msg.sender), " Withdrawer permission not granted.");
    uint withdrawAmount = Rentals[driver].deposit;
    Rentals[driver].deposit = 0;
    
    bool result = driver.send(withdrawAmount);
    require(result, "Withdraw failed");
    Rentals[driver].state = RentalState.Vacant;
    emit LogWithdraw(driver, withdrawAmount);
    return result;
}

/*
@notice Fetch Rental by driver's address(0x0)
Return the Rental Struct object
 */
function fetchRental(address payable driver) external override view  returns(uint rid, uint datetime, uint duration, uint deposit,address payable renter, uint cid, uint state) {

        rid = Rentals[driver].id; 
        datetime = Rentals[driver].datetime;
        duration = Rentals[driver].duration;
        deposit = Rentals[driver].deposit;
        renter = Rentals[driver].driver;
        cid = Rentals[driver].cid;  
        state = uint(Rentals[driver].state);  


return (rid, datetime, duration, deposit, renter,cid,state); 
}


/*
@notice Fetch all Rentals
Return the Rental Struct object
 */
function fetchRentals() external override view returns (address[] memory, uint){

    return (Drivers, Drivers.length);
}

}




