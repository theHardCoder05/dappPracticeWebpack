let BN = web3.utils.BN;
let CarRental = artifacts.require("CarRental");
let Ochestrator = artifacts.require("Ochestrator");
let { catchRevert } = require("./exceptionsHelpers.js");
const { cars: CarStruct, isDefined, isPayable, isType, rentals:RentalStruct } = require("./ast-helper");

contract("Car Rental", function (accounts) {
    const [_owner, alice, bob] = accounts;
    const emptyAddress = "0x0000000000000000000000000000000000000000";
    // Car params
    const price = "1000";
    const deposit = "1000";
    const carName = "BMW";
    const drivername = "Bob";
    // A-001
    const drivinglicenseid = "0x8C4565B43A25934E43A234404E197049FB30355FE5203D941B1297351CB5066C";
    const uid = 001;
    const duration = 14;
    const year = 1807;

    // Rental params
    // UTC timestamp format
    const datetime =  1636869118;

    let instance;
    let ochestraInstance;
    /*
     * Initiate Car Rental contract 
     */
    beforeEach(async () => {
      instance = await CarRental.new();
     
    });

    /*
     * Initiate Proxy contract 
     */
    beforeEach(async () => {
      ochestraInstance = await Ochestrator.new();
     
    });


     /*
     * To test if owner is exists
     */
     describe("Variables", () => {
        it("should have an owner", async () => {
          assert.equal(typeof instance.owner, 'function', "the contract has no owner");
        });
        
    });

    /*
     * To test if all Rental enumeration 
     */
    describe("enum Rental State", () => {
        let enumState;
        before(() => {
          enumState = CarRental.enums.RentalState;
          assert(
            enumState,
            "The contract should define an Enum called State"
          );
        });
        it("should define `ForRent`", () => {
            assert(
              enumState.hasOwnProperty('Vacant'),
              "The enum does not have a `Vacant` value"
            );
          });

          it("should define `Occuppied`", () => {
            assert(
              enumState.hasOwnProperty('Occuppied'),
              "The enum does not have a `Occuppied` value"
            );
          });
    });
 
    
      /*
     * Initiate Car Rental contract struct ensure all properties are exists 
     */
      describe("Rental struct", () => {
        let subjectStruct;

        before(() => {
          subjectStruct = RentalStruct(CarRental);
          assert(
            subjectStruct !== null, 
            "The contract should define an `Rental Struct`"
          );
        });
        it("should have a `id`", () => {
            assert(
              isDefined(subjectStruct)("id"), 
              "Struct Rental should have a `id` member"
            );
            assert(
              isType(subjectStruct)("id")("uint"), 
              "`id` should be of type `uint`"
            );
          });   
          it("should have a `datetime`", () => {
            assert(
              isDefined(subjectStruct)("datetime"), 
              "Struct Rental should have a `datetime` member"
            );
            assert(
              isType(subjectStruct)("datetime")("uint"), 
              "`datetime` should be of type `uint`"
            );
          }); 
          it("should have a `duration`", () => {
            assert(
              isDefined(subjectStruct)("duration"), 
              "Struct Rental should have a `duration` member"
            );
            assert(
              isType(subjectStruct)("duration")("uint"), 
              "`duration` should be of type `uint`"
            );
          }); 
          it("should have a `deposit`", () => {
            assert(
              isDefined(subjectStruct)("deposit"), 
              "Struct Rental should have a `deposit` member"
            );
            assert(
              isType(subjectStruct)("deposit")("uint"), 
              "`deposit` should be of type `uint`"
            );
            
          });

          it("should have a `drivername`", () => {
            assert(
              isDefined(subjectStruct)("drivername"), 
              "Struct Rental should have a `drivername` member"
            );
            assert(
              isType(subjectStruct)("drivername")("string"), 
              "`drivername` should be of type `string`"
            );
            
          });

          it("should have a `drivinglicenseid`", () => {
            assert(
              isDefined(subjectStruct)("drivinglicenseid"), 
              "Struct Rental should have a `drivinglicenseid` member"
            );
            assert(
              isType(subjectStruct)("drivinglicenseid")("bytes32"), 
              "`drivinglicenseid` should be of type `bytes32`"
            );
            
          });
      });

      /*
     * To test the Rent Car function with expected result
     */
      describe("Use case - Rent a car", () => {
        it("should rent a car with uid, render(address), datetime,", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
          //let txHash = await web3.eth.sendTransaction({from: bob, to:instance.address, value:web3.utils.toWei('1', "ether") });
          // await instance.payDeposit({ from: bob, value: web3.utils.toWei(web3.utils.toBN('1'), "ether") });
          const result = await instance.fetchRental.call(bob);
          let SCBalance = await web3.eth.getBalance(instance.address)
          console.log("Current Balance in escrow:" +  SCBalance);
    
          assert.equal(
            result[0],
            0,
            "the rid of the last added Rental does not match the expected value",
          );
          assert.equal(
            result[1],
            datetime,
            "the datetime of the last added Rental does not match the expected value",
          );
          assert.equal(
            result[2],
            14,
            "the duration of the last added Rental does not match the expected value",
          );
          assert.equal(
            result[3],
            deposit,
            "the receivedAmount of the last added Rental does not match the expected value",
          );
          assert.equal(
            result[4],
            bob,
            "the address(bob) of the last added Rental does not match the expected value",
          );
          assert.equal(
            result[5],
            uid,
            "the car id  of the last added Rental does not match the expected value",
          );
        
        });
    
      });
    

      /*
     * To test the Withdraw function to ensure all result are met the expectation.
     */
      describe("Use case - Withdraw deposit" , () => {
        it("should rent and refund without error", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,   datetime, { from: bob, value: deposit });
          const tx = await instance.withdraw(bob ,{ from: _owner });
          const Rentalresult = await instance.fetchRental.call(bob);
          let SCBalanceAfter = await web3.eth.getBalance(instance.address);
          let BobBalance = await web3.eth.getBalance(bob);
          console.log('Bob balance:' + BobBalance);
          if (tx.logs[0].event == "LogWithdraw") {
            eventEmitted = true;
          }
    
          assert.equal(
            eventEmitted,
            true,
            "adding an item should emit a Shipped event",
          );
          // The remaining deposit amount in the Agent contract is 300(30% of 1000)
          assert.equal(
            SCBalanceAfter,
            300,
            "the deposit after withdraw does not match the expected value",
           );
           assert.equal(
            BobBalance,
            (+BobBalance + +700),
            "Bob should receive 700 back from refund",
           );
          assert.equal(
            Rentalresult[3],
            0,
            "the Renter's deposit(Should set to 0) of withdraw Rental does not match the expected value",
          );
          assert.equal(
            Rentalresult[6],
            CarRental.RentalState.Vacant,
            "the state of withdraw Rental does not match the expected value",
          );

        });
      })

     /*
     * To test make sure no same driver is double booking
     */
      describe.skip("Use case - Rent a car double booking", () => {
        it("should rent a car with uid, render(address), datetime,", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
         
        });
    
      });


     /*
     * To test to get all rentals
     */
        describe("Use case - Rent a cars with return addresses and the count ", () => {
          it("should return the expected addresses and count of the array", async () => {
            await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
            await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: alice, value: deposit });
            const result = await instance.fetchRentals.call();
            assert.equal(
              result[1],
              2,
              "The count of the address should be 2",
            );
           
          });
      
        });
        // Test proxy contract
        describe("Use case - Yeild out all rentals through proxy contract ", () => {
          it("should return the expected addresses", async () => {
            await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
            await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: alice, value: deposit });
            const result = await ochestraInstance.fetchRentalsFromProxy.call(instance.address);
            console.log(result);
            assert.equal(
              result.length,
              2,
              "The count of the address should be 2",
            );
           
          });
      
        });


        // Test to add a new car into the Smart Contract(Rental contract)
        describe("Use case - To add a new car into the Rental contract ", () => {
          it("should return true as expected result", async () => {
            const carName = "Honda City";
            const engineId = "001928399"
            const result = await ochestraInstance.addNewCarUpgradeble.call(instance.address, carName, engineId);
            console.log(result);
     
           
          });
      
        });
  });