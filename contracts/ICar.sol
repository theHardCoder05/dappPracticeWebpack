// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// IRental inteface a blueprint of the Car class
interface ICar {

    /*
    @notice: -A simple Car struct. This potentially can be an important struct to store FRID'Id, GPS, Engine's Id and etc.
    @param: - Auto id
    @param: Car's engine id
    @params: Car model name
    */

    struct Car{
        uint id;
        uint engineId;
        string name;
    }

   
    // add new car function 
    function addNewCar(uint _id, string calldata _carName, uint engineId) external returns(bool);

    // fetch car in stock
    function fetchCars() external view returns (Car[] calldata);
}