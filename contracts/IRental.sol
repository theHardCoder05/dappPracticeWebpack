// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

// Interface of the library class.
interface IRental {
    
    // getting status
    function getStatus() external view returns (uint);
    // get all the cars from library
    function getAllCars() external returns (bytes32 [] memory);
    // rent car
    function rentCar(bytes32 name, uint256 book_id) external;
    // return car
    function returnCar() external;
    
    
}