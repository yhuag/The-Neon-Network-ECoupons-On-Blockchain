pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract Coupon is StandardToken {
  // Configuration
  string public constant name = "E-Coupon General Grant";
  string public constant symbol = "EGG";
  uint256 public startTime;
  uint256 public endTime;
  uint256 public unit;

  uint8 public constant DECIMALS = 18;
  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(DECIMALS));
  address public constant ISSUER_ADDRESS = 0x8484345ec508cd007470b2eab04ddb61b5198305;  // TODO: To be changed


  // Balance for each account
  mapping(address => uint256) balances;

  // Balace used for each account
  mapping(address => uint256) balancesUsed;

  // Approval of transfer
  mapping(address => mapping(address => uint256)) allowed;

  // Functions with this modifier can only be executed by the issuer
  modifier onlyIssuer() {
    assert(msg.sender == ISSUER_ADDRESS);
    _;
  }

  // Check whether the redeem time is between the span of startTime and endTime.
  modifier isValidRedeemTime(){
    require(startTime <= now);
    require(endTime >= now);
    _;
  } 

  // Check whether the amount is an integral number of units.
  modifier isValidRedeemAmount(uint256 _amount){
    require(_amount % unit == 0);
    _;
  }

  // Constructor: called by the coupon issuer. A user can only redeem an integral number of units at a time.
  function Coupon(uint256 _startTime, uint256 _endTime, address user, uint256 _unit) onlyIssuer {
    require(_endTime >= _startTime);

    balances[user] = INITIAL_SUPPLY; 
    totalSupply = totalSupply.add(INITIAL_SUPPLY);  // The supply of a newly created coupon adds to totalSupply of the coupon system
    startTime = _startTime;
    endTime = _endTime;
    unit = _unit;
  }

  // Update the balances/balancesUsed of the user when coupon redeemed (Partial)
  function redeemPartialByUnit(uint256 amount) public isValidRedeemTime isValidRedeemAmount(amount) returns (bool success) {
    require(balances[msg.sender] >= amount);

    balancesUsed[msg.sender] = balancesUsed[msg.sender].add(amount);
    balances[msg.sender] = balances[msg.sender].sub(amount);

    success = true; 
  }

  // Update the balances/balancesUsed of the user when coupon redeemed (Complete)
  function redeemComplete() public isValidRedeemTime returns (bool success) {
    require(balances[msg.sender] >= INITIAL_SUPPLY);

    balancesUsed[msg.sender] = balancesUsed[msg.sender].add(INITIAL_SUPPLY);
    balances[msg.sender] = balances[msg.sender].sub(INITIAL_SUPPLY);

    success = true; 
  }

  // Only the issuer can check the balance of a specific user
  function checkBalances(address user) onlyIssuer constant returns (uint256 _balances) {
    _balances = balances[user];
  }

  // Only the issuer can check the balanceUsed of a specific user
  function checkBalancesUsed(address user) onlyIssuer constant returns (uint256 _balancesUsed) {
    _balancesUsed = balancesUsed[user];
  }

  // Anyone can check their personal balances
  function getAccountBalances() public constant returns (uint256 _balances) {
    _balances = balances[msg.sender];
  }

  // Anyone can check their personal balances
  function getAccountBalancesUsed() public constant returns (uint256 _balances) {
    _balances = balancesUsed[msg.sender];
  }
}
