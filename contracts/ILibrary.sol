// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

// Interface of the library class.
interface ILibrary {
    
    // getting status
    function getStatus() external view returns (uint);
    // get all the books from library
    function getAllBooks() external returns (bytes32 [] memory);
    // rent book
    function rentBook(bytes32 name, uint256 book_id) external;
    // return book
    function returnBook() external;
    
    
}