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
    let coupon = await Coupon.new(0, 0, 10, 10, accounts[0]);
    var ID = await coupon.ID.call();
    var startTime = await coupon.startTime.call();
    var value = await coupon.value.call();
    assert.equal(ID, 0, "ID incorrect");
    assert.equal(startTime, 0, "startTime incorrect");
    assert.equal(value, 10, "value incorrect");
  });

  it("redeem", async function(){
    let coupon = await Coupon.new(0, 0, 10, 10, accounts[0]);
    coupon.redeem();
    var owner = await coupon.owner.call();
    var issuer = await coupon.issuer.call();
    assert.equal(owner, issuer, "owner incorrect");
  });

  it("transfer", async function(){
    let coupon = await Coupon.new(0, 0, 10, 10, accounts[0]);
    coupon.transfer(accounts[1]);
    var owner = await coupon.owner.call();
    assert.equal(owner, accounts[1], "owner incorrect");
  });
  
});

contract('Integration', function(accounts) {
  it("Coupon Distribution Test", async function() {
    let market = await Market.new();
  
    var couponReceipt = await market.createCoupon(0, 10, 10);

    var couponID = couponReceipt.logs[0].args.id.toNumber();
    var couponAddr = couponReceipt.logs[0].args.new_address;
    //console.log(couponID, couponAddr);

    // Get coupon instance
    var coupon = Coupon.at(couponAddr);

    var owner = await coupon.owner.call();
    console.log(owner);

    var out = await coupon.transfer(accounts[1], {from: owner});
    console.log(out);
    owner = await coupon.owner.call();
    console.log(owner);


    // couponID = couponIDObj.toNumber();
    // console.log(couponID);
    // let couponAddress = await market.getCouponAddrByID.call(couponID);
    // console.log(couponAddress);

    // couponIDObj = await market.createCoupon.call(0, 10, 10);
    // couponID = couponIDObj.toNumber();
    // console.log(couponID);
    // couponAddress = await market.getCouponAddrByID.call(couponID);
    // console.log(couponAddress);
  });
});
