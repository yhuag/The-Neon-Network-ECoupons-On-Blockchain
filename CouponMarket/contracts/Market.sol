pragma solidity ^0.4.13;

import "./Coupon.sol";

contract Market {

  uint public volume;   // total volume of coupons
  address[] public users;  // store user addresses
  mapping (uint => address) coupons;   // store coupon IDs and coupon addresses

    // Constructor
    function Market() public {
        volume = 0;
    }

    // Coupon creater
    function createCoupon() public returns (address) {
        Coupon coupon = new Coupon();
        ++volume;   // Increment total volume
        return coupon;
    }

    // Tracker
    // function getIssuer(uint couponId) public returns (address) {
    //     coupons[couponId]
    // }

}