pragma solidity ^0.4.13;

import "./Coupon.sol";

contract Market {

    uint256 public volume;   // total volume of coupons
    //   address[] public users;  // store user addresses
    mapping (uint256 => address) coupons;   // store coupon IDs --> coupon addresses

    // Constructor
    function Market() public {
        volume = 0;
    }

    // Get Available ID
    function getNextID() returns (uint256) {
        ++volume;   // Increment total volume
        return volume;
    }

    // Coupon creater
    function createCoupon(uint256 startTime, uint256 endTime, uint256 value) public returns (address) {
        return new Coupon(getNextID(), startTime, endTime, value);
    }

    // Coupon register
    function registerCoupon(uint256 couponID, address couponAddress) public returns (address) {
        coupons[couponID] = couponAddress;
    }

    // Track coupon
    // function 

    // Tracker
    // function getIssuer(uint256 couponID) public returns (address) {
    //     coupons[couponID]
    // }

}