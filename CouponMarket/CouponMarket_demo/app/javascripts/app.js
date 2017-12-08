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
      console.log(accounts)
    });
  },

  setStatus: function (message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  getAccs: function () {
    return accounts;
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

  transfer: async function (holderAddr, receiverAddr) {
    // Get coupon instance
    var coupon = Coupon.at(holderAddr);
    var owner = await coupon.owner.call();

    // "Transfer" the coupon ownership from the issuer
    var receipt = await coupon.transfer(receiverAddr, { from: owner });

    // Get receiver and validate
    var receiver = await coupon.owner.call(); // should be receiverAddr
    return receiver == receiverAddr;
  },

  redeem: async function (holderAddr) {
    var coupon = Coupon.at(holderAddr);
    // "Redeem" the coupon 
    var receipt = await coupon.redeem({ from: receiver });

    // Get current owner and validate
    var owner = await coupon.owner.call();
    assert.equal(owner, issuer, "owner should be the issuer after redeem action");
  },



  // refreshBalance: function() {
  //   var self = this;

  //   var meta;
  //   Market.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.getBalance.call(account, {from: account});
  //   }).then(function(value) {
  //     var balance_element = document.getElementById("balance");
  //     balance_element.innerHTML = value.valueOf();
  //   }).catch(function(e) {
  //     console.log(e);
  //     self.setStatus("Error getting balance; see log.");
  //   });
  // },

  // sendCoin: function() {
  //   var self = this;

  //   var amount = parseInt(document.getElementById("amount").value);
  //   var receiver = document.getElementById("receiver").value;

  //   this.setStatus("Initiating transaction... (please wait)");

  //   var meta;
  //   Market.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.sendCoin(receiver, amount, {from: account});
  //   }).then(function() {
  //     self.setStatus("Transaction complete!");
  //     self.refreshBalance();
  //   }).catch(function(e) {
  //     console.log(e);
  //     self.setStatus("Error sending coin; see log.");
  //   });
  // }
};

window.addEventListener('load', function () {
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
});
