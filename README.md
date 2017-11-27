# UROP_Blockchain_Application
This is a University Research Project on e-coupons

# Development & Testing
1. First clone the repository or download as zip file
2. `cd` the repository just created and `cd ECoupon`
3. run `npm install` to install all the dependencies
4. In another terminal window, run `testrpc` to start a node with 10 addresses
5. run `truffle test` under the `ECoupon` directory to execute the test script
6. You should see the testing result `passing` soon!

# Test Cases
## Compilation, Deplyment and Logon to the testnet
```
cd ECoupon
testrpc  // In another window
truffle migrate --reset
truffle console
```
## Initialization
```
accounts = web3.eth.accounts
var startTime = web3.eth.getBlock("latest").timestamp
var endTime = startTime + 60 * 60 * 60 * 1000
```
## Create the first coupon
```
Coupon.new(startTime, endTime, accounts[1], 1000 * (10 ** 18))
coupon = Coupon.at("<the first contract address>")
```
## Check Balances (two ways)
```
coupon.checkBalances(accounts[1])
coupon.getAccountBalances({from: accounts[1]})
```
## Redeem the first coupon completedly
```
coupon.redeemComplete({from: accounts[1]})
coupon.getAccountBalances({from: accounts[1]})
```
## Create the second coupon
```
Coupon.new(startTime, endTime, accounts[1], 1000 * (10 ** 18))
coupon_new = Coupon.at("<the second contract address>")
```
## Redeem the second coupon completedly
```
coupon_new.redeemPartialByUnit(1000*10**18, {from: accounts[1]})
coupon_new.checkBalances(accounts[1])   // Should be 9000
coupon_new.checkBalancesUsed(accounts[1])   // Should be 1000
```

# Issue & Bug-shooting
## Solving Port Conflict
1. Run `lsof -i tcp:8545` to check whether any process is occupying port 8545
2. Identify the process id `PID` and run `kill <PID>` to kill the process
3. This will release the resource for testrpc to run on port 8545