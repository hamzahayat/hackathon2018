pragma solidity ^0.4.10;

contract request {
    
    
    event sendReq (address reqTo, address reqFrom, uint reqValue);
    event reciReq (string txHash, address repTo, bool status);
    
    function sendRequest(address reqTo, address reqFrom, uint reqValue) public {
         sendReq (reqTo, reqFrom, reqValue);
    } 
    
    function recievedRequest(string txHash, address repTo, bool status) public {
         reciReq (txHash, repTo, status);
    }
    
}