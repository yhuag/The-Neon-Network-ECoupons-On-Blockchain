pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract Coupon is StandardToken {
  // Configuration
  string public constant name = "E-Coupon General Grant";
  string public constant symbol = "EGG";
  uint8 public constant decimals = 18;
  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

  // Owner of the contract
  address public owner;

  // Balance for each account
  mapping(address => uint256) balances;

  // Approval of transfer
  mapping(address => mapping(address => uint256)) allowed;

  // Functions with this modifier can only be executed by the owner
  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  // Constructor
  function Coupon() {
    owner = msg.sender;
    balances[owner] = INITIAL_SUPPLY;
    totalSupply = INITIAL_SUPPLY;
  }

  function totalSupply() constant returns (uint256 totalSupply) {
    totalSupply = _totalSupply;
  }






}
