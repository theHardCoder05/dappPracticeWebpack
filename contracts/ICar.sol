// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// IRental inteface a blueprint of the Car class
interface ICar {

    // add new car function 
    function addNewCar(string calldata _carName, uint _price, uint _uid, uint year) external returns(bool);

    // fetch car in stock
    function fetchCar(uint _uid) external view returns (uint, string memory , uint, uint, uint);
}