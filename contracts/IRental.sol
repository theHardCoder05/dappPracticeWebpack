// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// IRental inteface a blueprint of the Rental class
interface IRental {


    // Rent Car function with uid and renter's address
    // Payable function to pay deposit
    function rentCar(uint _uid, string calldata drivername, bytes32 drivinglicenseid, uint _datetime) external payable returns(bool);
    // Withdraw deposit back to renter
    function withdraw(address payable renter) external payable returns (bool);
    // fetch Rental 
    function fetchRental(address payable _renter) external view returns (uint,uint,uint,uint,address payable,uint,uint);
    // Get all rentals(struct) and count
    function fetchRentals() external view returns (address[] calldata, uint);
}