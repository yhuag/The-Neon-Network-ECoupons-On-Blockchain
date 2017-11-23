var Coupon = artifacts.require("Coupon");
var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);

contract('Coupon', function (accounts) {

  let coupon;

  // Initialization: get startTime & endTime and create Coupon instance
  beforeEach(async function () {
    var startTime = web3.eth.getBlock("latest").timestamp;
    var endTime = startTime + 60 * 60 * 60 * 1000; // endTime is 1 hour after startTime
    coupon = await Coupon.new(startTime, endTime);
  });

  // Redeem coupon and check whether balancesUsed + balances = initial balance
  it('redeem coupon and check balances equality', async function () {
    var amountToBeUsed = 100;
    var initialBalance = await coupon.checkBalances(accounts[0]);

    if (await coupon.redeem(amountToBeUsed, { from: accounts[0] }) == true) {
      var balancesUsed = await coupon.checkBalancesUsed(accounts[0]);
      var balancesLeft = await coupon.checkBalances(accounts[0]);

      assert.equal(initialBalance - balancesUsed, balancesLeft, 'balance not match');
    }
  });



})
