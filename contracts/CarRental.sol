// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
// import "@openzeppelin/contracts/access/Ownable.sol";
contract CarRental {
    address public owner;
    // Enum status for car rental
    enum State {ForRent, Occuppied, UnderMaintenance }

    // Cars records
    mapping(uint => Car) public Cars;

    // events for car rental
    event LogForRent(uint id);

    // event log for Occuppied
    event LogForOccuppied(uint id);

    // event Car rental contract created
    event LogForCreated(address add);

    // Car Struct
    struct Car {
        string name;
        uint fee;
        State state;
        address payable renter;
        address payable owner;
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

}