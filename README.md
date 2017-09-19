# UROP_Blockchain_Application
This is a University Research Project on e-coupons

# Development & Testing
1. First clone the repository or download as zip file
2. `cd` the repository just created and `cd ECoupon`
3. run `npm install` to install all the dependencies
4. In another terminal window, run `testrpc` to start a node with 10 addresses
5. run `truffle test` under the `ECoupon` directory to execute the test script
6. You should see the testing result `passing` soon!

# Issue & Bug-shooting
## Solving Port Conflict
1. Run `lsof -i tcp:8545` to check whether any process is occupying port 8545
2. Identify the process id `PID` and run `kill <PID>` to kill the process
3. This will release the resource for testrpc to run on port 8545
