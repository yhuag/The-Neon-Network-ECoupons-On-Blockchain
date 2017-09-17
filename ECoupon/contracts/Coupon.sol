pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract Coupon is StandardToken {
  // Configuration
  string public constant name = "E-Coupon General Grant";
  string public constant symbol = "EGG";
  uint256 public startTime;
  uint256 public endTime;

  uint8 public constant decimals = 18;
  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

  // Owner of the contract
  address public owner;

  // Balance for each account
  mapping(address => uint256) balances;

  // Balace used for each account
  mapping(address => uint256) balancesUsed;

  // Approval of transfer
  mapping(address => mapping(address => uint256)) allowed;

  // Functions with this modifier can only be executed by the owner
  modifier onlyOwner() {
    if (msg.sender != owner) {
      throw;
    }
    _;
  }

  modifier isValidTime(){
    require(startTime <= now);
    require(endTime >= now);
    _;
  } 

  // Constructor
  function Coupon(uint256 _startTime, uint256 _endTime) {
    require(_startTime >= now);
    require(_endTime >= _startTime);

    owner = msg.sender;
    balances[owner] = INITIAL_SUPPLY;
    totalSupply = INITIAL_SUPPLY;
    startTime = _startTime;
    endTime = _endTime;
  }

  function useCoupon(uint256 amount) public isValidTime returns (bool success) {
    require(balances[msg.sender] >= amount);

    balancesUsed[msg.sender].add(amount);
    balances[msg.sender].sub(amount);

    success = true; 
  }

  function checkBalancesUsed(address user) onlyOwner constant returns (uint256 _balancesUsed) {
    _balancesUsed = balancesUsed[user];
  }

  function checkBalances(address user) onlyOwner constant returns (uint256 _balances) {
    _balances = balances[user];
  }
}
