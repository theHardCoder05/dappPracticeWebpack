let BN = web3.utils.BN;
let CarRental = artifacts.require("CarRental");
let { catchRevert } = require("./exceptionsHelpers.js");
const { cars: CarStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("Car Rental", function (accounts) {
    const [_owner, alice, bob] = accounts;
    const emptyAddress = "0x0000000000000000000000000000000000000000";
  
    const fee = "1000";
    const excessAmount = "2000";
    const carName = "BMW";
  
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

          it("should define `Occuppied`", () => {
            assert(
              enumState.hasOwnProperty('Occuppied'),
              "The enum does not have a `Occuppied` value"
            );
          });

          it("should define `UnderMaintenance`", () => {
            assert(
              enumState.hasOwnProperty('UnderMaintenance'),
              "The enum does not have a `UnderMaintenance` value"
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
              "Struct Item should have a `name` member"
            );
            assert(
              isType(subjectStruct)("name")("string"), 
              "`name` should be of type `string`"
            );
          });

          it("should have a `fee`", () => {
            assert(
              isDefined(subjectStruct)("fee"), 
              "Struct Item should have a `fee` member"
            );
            assert(
              isType(subjectStruct)("fee")("uint"), 
              "`fee` should be of type `uint`"
            );
          });
     

          it("should have a `state`", () => {
            assert(
              isDefined(subjectStruct)("state"), 
              "Struct Item should have a `state` member"
            );
            assert(
              isType(subjectStruct)("state")("State"), 
              "`state` should be of type `State`"
            );
          });
    
          it("should have a `renter`", () => {
            assert(
              isDefined(subjectStruct)("renter"), 
              "Struct Item should have a `renter` member"
            );
            assert(
              isType(subjectStruct)("renter")("address"), 
              "`renter` should be of type `address`"
            );
            assert(
              isPayable(subjectStruct)("renter"), 
              "`renter` should be payable"
            );
          });
    
          it("should have a `owner`", () => {
            assert(
              isDefined(subjectStruct)("owner"), 
              "Struct Item should have a `owner` member"
            );
            assert(
              isType(subjectStruct)("owner")("address"), 
              "`owner` should be of type `address`"
            );
            assert(
              isPayable(subjectStruct)("owner"), 
              "`owner` should be payable"
            );
          });
    });
    
 
    // Unit test cases
    describe("Use cases", () => {
        it("should add an item with the provided name and price", async () => {
          await instance.addItem(carName, fee, { from: alice });
    
          const result = await instance.fetchItem.call(0);
    
          assert.equal(
            result[0],
            carName,
            "the carName of the last added item does not match the expected value",
          );
          assert.equal(
            result[2].toString(10),
            price,
            "the price of the last added item does not match the expected value",
          );
          assert.equal(
            result[3].toString(10),
            SupplyChain.State.ForSale,
            'the state of the item should be "For Sale"',
          );
          assert.equal(
            result[4],
            alice,
            "the address adding the item should be listed as the seller",
          );
          assert.equal(
            result[5],
            emptyAddress,
            "the buyer address should be set to 0 when an item is added",
          );
        });
    
      });
    
  });