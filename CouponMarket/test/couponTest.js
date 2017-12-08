var Coupon = artifacts.require("./Coupon.sol");
var Market = artifacts.require("./Market.sol");

contract('Market', function(accounts) {
  it("Accessibility Test", function() {});

  it("Market Instantiation Test", async function() {
    let market = await Market.new();
    var volume = await market.volume.call();
    assert.equal(volume, 0, "volume is not zero");
  });

  it("Market Next ID Test", async function() {
    let market = await Market.new();
    var volume = await market.getNextID.call();
    assert.equal(volume, 1, "volume should be 1");
  });

  // it("Market Create Coupon Test", async function() {
  //   let market = await Market.new();
  //   var coupon = await market.createCoupon(0, 10, 10);
  //   var contractAddress = coupon.logs[0].address;
  //   assert.notEqual(contractAddress, null, "contract address should not be null");
  // });
});

contract('Coupon', function(accounts) {

  it("Coupon Instantiation Test", async function() {
    let coupon = await Coupon.new(0, 0, 10, 10);
    var ID = await coupon.ID.call();
    var startTime = await coupon.startTime.call();
    var value = await coupon.value.call();
    assert.equal(ID, 0, "ID incorrect");
    assert.equal(startTime, 0, "startTime incorrect");
    assert.equal(value, 10, "value incorrect");
  });

  it("redeem", async function(){
    let coupon = await Coupon.new(0, 0, 10, 10);
    coupon.redeem();
    var owner = await coupon.owner.call();
    var issuer = await coupon.issuer.call();
    assert.equal(owner, issuer, "owner incorrect");
  });

  it("transfer", async function(){
    let coupon = await Coupon.new(0, 0, 10, 10);
    coupon.transfer(accounts[1]);
    var owner = await coupon.owner.call();
    assert.equal(owner, accounts[1], "owner incorrect");
  });
  
});

contract('UseCase', function(accounts) {

});
