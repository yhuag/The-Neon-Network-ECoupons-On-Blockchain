// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import Market_artifacts from '../../build/contracts/Market.json'
import Coupon_artifacts from '../../build/contracts/Coupon.json'

// Market is our usable abstraction, which we'll use through the code below.
var Market = contract(Market_artifacts);
var Coupon = contract(Coupon_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function () {
    var self = this;

    // Bootstrap the Market abstraction for Use.
    Market.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    Coupon.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
  },

  setStatus: function (message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  getAccs: async function () {
    return web3.eth.accounts;
  },

  newCoupon: async function (value = 10, startTime = 0, endTime = 10) {
    // Create market
    let market = await Market.deployed();

    var coupon_info = {};
    coupon_info.startTime = startTime;
    coupon_info.endTime = endTime;
    coupon_info.value = value;
    coupon_info.owner = accounts[0];

    // // Set coupon default issuer
    coupon_info.issuer = accounts[0];

    // Create coupon
    var couponReceipt = await market.createCoupon(startTime, endTime, value, { from: account, gas: 1000000 });

    // Get coupon ID, Address, and owner
    coupon_info.ID = couponReceipt.logs[0].args.id.toNumber();
    coupon_info.address = couponReceipt.logs[0].args.new_address;

    // Get coupon instance
    var coupon = Coupon.at(coupon_info.address);
    coupon_info.owner = await coupon.owner.call();
    return coupon_info;
  },

  getOwner: async function (couponID) {
    let market = await Market.deployed();
    var couponAddr = await market.getCouponAddrByID.call(couponID);
    var coupon = Coupon.at(couponAddr);
    var owner = await coupon.owner.call();
    return owner;
  },

  transfer: async function (couponID, receiverAddr) { // return true if success
    let market = await Market.deployed();
    var couponAddr = await market.getCouponAddrByID.call(couponID);

    // Get coupon instance
    var coupon = Coupon.at(couponAddr);
    var owner = await coupon.owner.call();

    // "Transfer" the coupon ownership from the issuer
    var receipt = await coupon.transfer(receiverAddr, { from: owner });

    // Get receiver and validate
    var receiver = await coupon.owner.call(); // should be receiverAddr
    return receiver == receiverAddr;
  },

  redeem: async function (couponID) { // return true if success
    let market = await Market.deployed();
    var couponAddr = await market.getCouponAddrByID.call(couponID);
    var coupon = Coupon.at(couponAddr);
    // "Redeem" the coupon 
    var receipt = await coupon.redeem({ from: couponAddr });

    // Get current owner and validate
    var owner = await coupon.owner.call();
    var issuer = await coupon.issuer.call();
    return owner == issuer;
  },
};

window.addEventListener('load', async function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 Market, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();

  var accounts = await App.getAccs();
  console.log(accounts);
  for (var i = 0; i < accounts.length; i++) {
    $('#receiver:last-child').append(`
      <option value="`+ accounts[i] + `">` + accounts[i] + `</option>
    `);
  }

  $('#create_coupon').click(async function () {
    console.log('create coupon btn clicked!');
    var value = $('#value').val() || 100;
    var startTime = $('#startTime').val() || 0;
    var endTime = $('#endTime').val() || 10;
    var coupon_info = await App.newCoupon(value, startTime, endTime);
    $('#coupon_info > tbody:last-child').append(`
      <tr>
        <td>`+ coupon_info.ID + `</td>
        <td>`+ coupon_info.owner + `</td>
        <td>`+ coupon_info.issuer + `</td>
        <td>`+ coupon_info.value + `</td>
        <td>`+ coupon_info.startTime + `</td>
        <td>`+ coupon_info.endTime + `</td>
      </tr>
      `);
    console.log(coupon_info);
    return false;
  });
  $('#transfer').click(async function () {
    console.log('transfer btn clicked!');

    var couponID = $('#id').val() || 1;
    var receiver = $('#receiver').val() || accounts[1];

    // Check if the coupon owner is correct 
    var owner = await App.getOwner(couponID);
    console.log(owner);
    if ($('#owner').val() != owner) {
      alert("coupon owner incorrect!");
      return;
    };

    // console.log(receiver);
    var success = await App.transfer(couponID, receiver);
    console.log(success);
  });
  $('#redeem').click(async function () {
    console.log('redeem btn clicked!');

    var couponID = $('#id2').val() || 1;

    // Check if the coupon owner is correct 
    var owner = await App.getOwner(couponID);
    if ($('#owner_redeem').val() != owner) {
      alert("coupon owner incorrect!");
      return;
    }

    var success = await App.redeem(couponID);
    console.log(success);
  });
});
