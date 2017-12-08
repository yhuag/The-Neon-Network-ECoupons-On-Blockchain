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
        volume = volume + 1;   // Increment total volume
        return volume;
    }

    // Coupon creater
    function createCoupon(uint256 startTime, uint256 endTime, uint256 value) public returns (uint256) {
        //Coupon coupon = new Coupon(getNextID(), startTime, endTime, value);
        var couponID = getNextID();
        address couponAddress = new Coupon(couponID, startTime, endTime, value);
        coupons[couponID] = couponAddress;
        return couponID;
    }


    // Track coupon
    // function 

    // Tracker
    // function getIssuer(uint256 couponID) public returns (address) {
    //     coupons[couponID]
    // }

}