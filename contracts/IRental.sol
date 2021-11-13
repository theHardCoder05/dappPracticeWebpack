// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

// IRental inteface a blueprint of the Rental class
interface IRental {

    // add new car function 
    function addNewCar(string calldata _carName, uint _deposit, uint _uid) external returns(bool);

    // fetch car in stock
    function fetchCar(uint _uid) external view returns (string memory , uint, uint);
}