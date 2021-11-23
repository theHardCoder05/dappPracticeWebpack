// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;


import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './IRental.sol';
import './ICar.sol';

/**
The abstract of the Smart Contract is to achieve disintermidiation objective. Drivers keep thier deposit in crypto (eth) in the Escrow Smart Contract.
This project potentially involves multiple entities and authoritises for due-diligent process. Such as KYC.
 */
contract CarRental is  Ownable, AccessControl, ReentrancyGuard, IRental, ICar {

    /*
    Use the Counter API to generate rental id.
     */
    using Counters for Counters.Counter;
    Counters.Counter private _rentalId;
    /*
    Using Safe Math
     */
    using SafeMath for uint;
    /*
    Define a withdrawer role in this contract
     */
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    /*
    Array list to store all drivers
     */
    // https://ethereum.stackexchange.com/questions/62824/how-can-i-build-this-list-of-addresses
    address[] public Drivers;
    
    /*
    Cars array list
     */
    Car[] public Cars;
    /*
    Enumeration of Rental contract's state to determine the contract status.
     */
    enum RentalState {Vacant, Occuppied }

    /*
    Auto generated ID - Potentially, could use ChainLink(Oracle).
     */
    uint  private rentalId;
    
    /*

    /*
    Auto generated ID - Potentially, could use ChainLink(Oracle).
     */
    uint  private carId;
    
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

    /**
    event log for fallback function trigger
     */
     event LogFallback(address caller, string message);
 
     /*
      @notice: Rental Struct Object/Entity
      @param: id - unique id
      @param: datetime - Concract created datetime in Epoch time format.
      @param: driver name - Driver name
      @param: driving License Id - In Bytes32 hash value - Anonymouse(GDPR).
      @param: duration - Renting period.
      @param: deposit - deposit for renting. Technically the price should based on the car model and capacity.
      @param: cid - The Car id
      @param: State - To determine th current of the Rental contract.
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
    @notice - A non-payable callback function to handle miscalled functions.
    */
    fallback() external {
        emit LogFallback(msg.sender, "Fallback was called!!!");
    }


/*
 @notice Car renting function 
 @param: uid - Unique id of the vehicle (It can be registration number or RFID)
 @param:  driver name - Name of the driver. Calldata to optimise the gas.
 @param:  driving license id - Driving Identify of the driver, this information should be masked and hashed to compliance with GDPR.
 @param:  booking date - The exact booking date.
 @param:  return - True. If no errors.
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
 @param: driver - The Driver
 Require to check if the msg.sender has the permission/ role to perform withdraw.
 @param: Return  - True. If no errors
 After the withdraw set the status back to Vacant for the next driver.
 @notice - A very simple Mathematics calculation here. The DepositAmount div by 100 -> x mul 30% -> DepositAmount sub x = refundAmount.
 @notice - In a nutshell - The Agent charge 30% for the total amount of car renting deposit. 30% to Agent and 70% back to Driver.
 */
function withdraw(address payable driver) external override payable nonReentrant onlyOwner() IsRefundable(Rentals[driver].driver)  returns (bool){
    require(hasRole(WITHDRAWER_ROLE, msg.sender), " Withdrawer permission not granted.");
    uint withdrawAmount = Rentals[driver].deposit;
    Rentals[driver].deposit = 0;
    uint  hundred = 100;
    uint thirdtyPrecentChargeFee = 30;
    uint divideValue = SafeMath.div(withdrawAmount,hundred);
    uint multiplyValue = SafeMath.mul(divideValue,thirdtyPrecentChargeFee);
    uint refundAmount = SafeMath.sub(withdrawAmount,multiplyValue);
    bool result = driver.send(refundAmount);
    require(result, "Withdraw failed");
    Rentals[driver].state = RentalState.Vacant;
    emit LogWithdraw(driver, withdrawAmount);
    return result;
}

/*
@notice: Fetch Rental by driver's address(0x0)
@param: Return the Rental Struct object
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
@notice: Fetch all Rentals
@param: Return the Rental Struct object
 */
function fetchRentals() external override view returns (address[] memory, uint){

    return (Drivers, Drivers.length);
}


/*
@notice: - Add a new car to the list
@param: engineid - Car's Engine Id
@param: name - Car model name
*/
function addNewCar(uint  _id, string memory _carName, uint _engineId) external override  returns (bool)
{
    
    Cars.push(Car({
        id: _id,
        engineId: _engineId,
        name: _carName
    }));
    emit LogRentCar(rentalId);
    return true;
}


/*
@notice: A function to fetch all cars
*/
function fetchCars() external override view returns (Car[] memory)
{
    return Cars;
}

}




