var Coupon = artifacts.require("./Coupon.sol");

module.exports = function(deployer) {
  deployer.deploy(Coupon);
};
