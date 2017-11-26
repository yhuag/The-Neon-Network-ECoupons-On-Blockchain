var Coupon = artifacts.require("Coupon");
var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);

contract('Coupon', function (accounts) {

  // let coupon;

  // Initialization: get startTime & endTime and create Coupon instance
  beforeEach(async function () {
    // var startTime = web3.eth.getBlock("latest").timestamp;
    // var endTime = startTime + 60 * 60 * 60 * 1000; // endTime is 1 hour after startTime
    // coupon = await Coupon.new(startTime, endTime);
  });

  // Test Complete Redeem (should success)
  it('redeem coupon completely', async function () {
    // Create coupon
    var startTime = web3.eth.getBlock("latest").timestamp;
    var endTime = startTime + 60 * 60 * 60 * 1000; // endTime is 1 hour after startTime
    let coupon = await Coupon.new(startTime, endTime, accounts[1], 1000);

    // Redeem completely
    if (await coupon.redeemComplete({ from: accounts[1] }) == true) {
      // Inits
      var balancesUsed = await coupon.checkBalancesUsed(accounts[1]);
      var balances = await coupon.checkBalances(accounts[1]);

      // Assertions
      assert.equal(balancesUsed, 10000 * (10 ** uint256(DECIMALS)), 'balancesUsed incorrect');
      assert.equal(balances, 0, 'balances incorrect and not empty');
    }
  });

  // // Test Partial Redeem (should success)
  // it('redeem coupon partially', async function () {
  //   // Create coupon
  //   var startTime = web3.eth.getBlock("latest").timestamp;
  //   var endTime = startTime + 60 * 60 * 60 * 1000; // endTime is 1 hour after startTime
  //   let coupon = await Coupon.new(startTime, endTime, accounts[1], 1000 * (10 ** uint256(DECIMALS)));

  //   // Redeem completely
  //   if (await coupon.redeemComplete({ from: accounts[1] }) == true) {
  //     // Inits
  //     var balancesUsed = await coupon.checkBalancesUsed(accounts[1]);
  //     var balances = await coupon.checkBalances(accounts[1]);

  //     // Assertions
  //     assert.equal(balancesUsed, 10000 * (10 ** uint256(DECIMALS)), 'balancesUsed incorrect');
  //     assert.equal(balances, 0, 'balances incorrect and not empty');
  //   }
  // });  

})
