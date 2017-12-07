var Coupon = artifacts.require("./Coupon.sol");
var Market = artifacts.require("./Market.sol");

contract('Market', function(accounts) {
  // it("Accessibility Test", function() {
  // });

  // it("Market Instantiation Test", async function() {
  //   let market = await Market.new();
  //   var volume = await market.volume.call();
  //   assert.equal(0, volume, "volume is not zero");
  // });

  // it("Market Next ID Test", async function() {
  //   let market = await Market.new();
  //   var volume = await market.getNextID.call();
  //   assert.equal(1, volume, "volume should be 1");
  // });

  it("Market Create Coupon Test", async function() {
    let market = await Market.new();
    var startTime = web3.eth.getBlock("latest").timestamp;
    var endTime = startTime + 60 * 60 * 60 * 1000;

    var coupon = await market.createCoupon(0, 10, 10);
    console.log(coupon.logs[0].address);
    // assert.equal(1, volume, "volume should be 1");
  });
});

contract('Coupon', function(accounts) {

  // it("Coupon Instantiation Test", async function() {
  //   let coupon = await Coupon.new(0, 0, 10, 10);
  //   var ID = await coupon.ID.call();
  //   var startTime = await coupon.startTime.call();
  //   var value = await coupon.value.call();
  //   assert.equal(0, ID, "ID incorrect");
  //   assert.equal(0, startTime, "startTime incorrect");
  //   assert.equal(10, value, "value incorrect");
  // });

  // it("redeem", async function(){
  //   let coupon = await Coupon.new(0, 0, 10, 10);
  //   coupon.redeem();
  //   var owner = await coupon.owner.call();
  //   var issuer = await coupon.issuer.call();
  //   assert.equal(issuer, owner, "owner incorrect");
  // });

  // it("transfer", async function(){
  //   let coupon = await Coupon.new(0, 0, 10, 10);
  //   coupon.transfer(accounts[1]);
  //   var owner = await coupon.owner.call();
  //   assert.equal(accounts[1], owner, "owner incorrect");
  // });
  
});
