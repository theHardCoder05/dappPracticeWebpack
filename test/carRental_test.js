let BN = web3.utils.BN;
let CarRental = artifacts.require("CarRental");
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
  
    beforeEach(async () => {
      instance = await CarRental.new();
     
    });


     // To make sure the public owner is exists
     describe("Variables", () => {
        it("should have an owner", async () => {
          assert.equal(typeof instance.owner, 'function', "the contract has no owner");
        });
        
    });

    // TO check all enum states exists
    describe("enum State", () => {
        let enumState;
        before(() => {
          enumState = CarRental.enums.State;
          assert(
            enumState,
            "The contract should define an Enum called State"
          );
        });
        it("should define `ForRent`", () => {
            assert(
              enumState.hasOwnProperty('ForRent'),
              "The enum does not have a `ForRent` value"
            );
          });

          it("should define `UnderMaintenance`", () => {
            assert(
              enumState.hasOwnProperty('UnderMaintenance'),
              "The enum does not have a `UnderMaintenance` value"
            );
          });
    });
    // Check Rental Status 
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
    // To check the properties of Car Struct
    describe("Car struct", () => {
        let subjectStruct;
  
        before(() => {
          subjectStruct = CarStruct(CarRental);
          assert(
            subjectStruct !== null, 
            "The contract should define an `Car Struct`"
          );
        });
        it("should have a `name`", () => {
            assert(
              isDefined(subjectStruct)("name"), 
              "Struct Car should have a `name` member"
            );
            assert(
              isType(subjectStruct)("name")("string"), 
              "`name` should be of type `string`"
            );
          });

          it("should have a `price`", () => {
            assert(
              isDefined(subjectStruct)("price"), 
              "Struct Car should have a `price` member"
            );
            assert(
              isType(subjectStruct)("price")("uint"), 
              "`price` should be of type `uint`"
            );
          });

          it("should have a `uid`", () => {
            assert(
              isDefined(subjectStruct)("uid"), 
              "Struct Car should have a `uid` member"
            );
            assert(
              isType(subjectStruct)("uid")("uint"), 
              "`uid` should be of type `uint`"
            );
          });

          it("should have a `year`", () => {
            assert(
              isDefined(subjectStruct)("year"), 
              "Struct Car should have a `year` member"
            );
            assert(
              isType(subjectStruct)("year")("uint"), 
              "`year` should be of type `uint`"
            );
          });

          it("should have a `state`", () => {
            assert(
              isDefined(subjectStruct)("state"), 
              "Struct Car should have a `state` member"
            );
            assert(
              isType(subjectStruct)("state")("State"), 
              "`state` should be of type `State`"
            );
          });
    
    
    
         
    });
    
 
// To check the properties of Rental Struct
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



    // Unit test cases
    describe.skip("Use case - Car", () => {
        it("should add a new Car with CarName, Price, Uid, Year", async () => {
          await instance.addNewCar(carName, price, uid, year, { from: _owner });
    
          const result = await instance.fetchCar.call(001);
          assert.equal(
            result[0],
            uid,
            "the Uid of the last added Car does not match the expected value",
          );
          assert.equal(
            result[1],
            carName,
            "the carName of the last added Car does not match the expected value",
          );
          assert.equal(
            result[2],
            price,
            "the price of the last added Car does not match the expected value",
          );
          assert.equal(
            result[3],
            CarRental.State.ForRent,
            "the State of the last added Car does not match the expected value",
          );

          assert.equal(
            result[4],
            year,
            "the Year of the last added Car does not match the expected value",
          );
         
        });
    
      });
    



      //  Test Renting car
      describe("Use case - Rent a car", () => {
        it("should rent a car with uid, render(address), datetime,", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
          //let txHash = await web3.eth.sendTransaction({from: bob, to:instance.address, value:web3.utils.toWei('1', "ether") });
          // await instance.payDeposit({ from: bob, value: web3.utils.toWei(web3.utils.toBN('1'), "ether") });
          const result = await instance.fetchRental.call(bob);
          let SCBalance = await web3.eth.getBalance(instance.address)
          console.log("Current Balance in escrow:" +  SCBalance);
          const carResult = await instance.fetchCar.call(001);
          assert.equal(
            carResult[3],
            CarRental.State.Rented,
            "the status of the car does not match the expected value",
          );


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
    

      // Test Withdraw deposit
      describe("Use case - Withdraw deposit" , () => {
        it("should rent and refund without error", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,   datetime, { from: bob, value: deposit });
          const tx = await instance.withdraw(bob ,{ from: _owner });
          const Rentalresult = await instance.fetchRental.call(bob);
          let SCBalanceAfter = await web3.eth.getBalance(instance.address)

          if (tx.logs[0].event == "LogWithdraw") {
            eventEmitted = true;
          }
    
          assert.equal(
            eventEmitted,
            true,
            "adding an item should emit a Shipped event",
          );
          assert.equal(
            SCBalanceAfter,
            0,
            "the deposit after withdraw does not match the expected value",
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

      //  Test Renting car with double booking
      describe.skip("Use case - Rent a car double booking", () => {
        it("should rent a car with uid, render(address), datetime,", async () => {
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
          await instance.rentCar(uid, drivername, drivinglicenseid,  datetime, { from: bob, value: deposit });
         
        });
    
      });


      // Test to fetch Drivers and the count
        //  Test Renting car
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

  });