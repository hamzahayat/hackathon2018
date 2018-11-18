pragma solidity ^0.4.10;

contract request {
    
    
    event IncomingRequest (string reqFrom, string reqTo, uint reqValue);
    event RequestAnswered (string reqFrom, string reqTo, string txHash, bool status, uint reqValue);
    
    function sendRequest(string reqFrom, string reqTo, uint reqValue) public {
         IncomingRequest (reqFrom, reqTo, reqValue);
    } 
    
    function requestAnswered(string reqFrom, string reqTo, string txHash, bool status, uint reqValue) public {
         RequestAnswered (reqFrom, reqTo, txHash, status, reqValue);
    }
    
}


