// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

// IRental inteface a blueprint of the Rental class
interface IRental {


    // Rent Car function with uid and renter's address
    // Payable function to pay deposit
    function rentCar(uint _uid, address payable  _renter, uint _datetime) external payable returns(bool);
    // Withdraw deposit back to renter
    function withdraw(address payable renter) external returns (bool);
        // fetch Rental 
    function fetchRental(address payable _renter) external view returns (uint,uint,uint,uint,address payable,uint,uint);
}