var Coupon = artifacts.require("Coupon");
var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('http//localhost:8545')
);

module.exports = function (deployer) {
  // var startTime = 1505320334 + 60 * 60 * 1000;
  // var endTime = startTime + 60 * 60 * 60 * 1000;
  // deployer.deploy(Coupon, startTime, endTime);
};
