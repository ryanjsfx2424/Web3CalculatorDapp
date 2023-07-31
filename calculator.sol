/**
 *Submitted for verification at Etherscan.io on 2023-07-30
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator {

    // blockspace access options: 
    // pure, view, (default)
    // pure: we do not read nor write
    // view: we read but don't write
    // default: we read and write

    // scope
    // public, external, internal, private
    // most gas -> least gas
    // most accessible -> least
    // most powerful -> least

    event OperationHappened(address indexed sender, uint num1, uint num2, uint indexed result);

    // calculator function with an uint where 0 means add, 1 means subtract
    function adder(uint num1, uint num2) external returns(uint) {
        uint result = num1+num2;
        emit OperationHappened(msg.sender, num1, num2, result);
        return result;
    }

    function subber(uint num1, uint num2) external returns(uint) {
        uint result = num1 - num2;
        emit OperationHappened(msg.sender, num1, num2, result);
        return result;
    }

    function multer(uint num1, uint num2) external returns(uint) {
        uint result = num1*num2;
        emit OperationHappened(msg.sender, num1, num2, result);
        return result;
    }

    function divver(uint num1, uint num2) external returns(uint) {
        uint result = num1/num2;
        emit OperationHappened(msg.sender, num1, num2, result);
        return result;
    }

}