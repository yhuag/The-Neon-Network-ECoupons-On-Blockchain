var Coupon = artifacts.require("Coupon");
var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);

contract('Coupon', function (accounts) {

  let coupon;

  beforeEach(async function () {
    var startTime = web3.eth.getBlock("latest").timestamp;
    var endTime = startTime + 60 * 60 * 60 * 1000; // endTime is 1 hour after startTime
    coupon = await Coupon.new(startTime, endTime);
  });


  it('spend coupon and check balances', async function () {
    var amountToBeUsed = 100;
    var initialBalance = await coupon.checkBalances(accounts[0]);

    if (await coupon.useCoupon(amountToBeUsed, { from: accounts[0] }) == true) {
      var balancesUsed = await coupon.checkBalancesUsed(accounts[0]);
      var balancesLeft = await coupon.checkBalances(accounts[0]);
      assert.equal(initialBalance - balancesUsed, balancesLeft, 'balance not match');
    }
  });
})
