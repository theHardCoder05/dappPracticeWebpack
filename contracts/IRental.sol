// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

// IRental inteface a blueprint of the Rental class
interface IRental {

    // Rent Car function with uid and renter's address
    function rentCar(uint _uid, address payable renter, uint datetime) external payable returns(bool);
}