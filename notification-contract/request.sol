pragma solidity ^0.4.10;

contract request {
    
    
    event IncomingRequest (address reqFrom, address reqTo, uint reqValue);
    event RequestAnswered (address reqFrom, address reqTo, string txHash, bool status);
    
    function sendRequest(address reqFrom, address reqTo, uint reqValue) public {
         IncomingRequest (reqTo, reqFrom, reqValue);
    } 
    
    function requestAnswered(address reqFrom, address reqTo, string txHash, bool status) public {
         RequestAnswered (reqFrom, reqTo, txHash, status);
    }
    
}