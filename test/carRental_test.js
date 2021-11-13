let BN = web3.utils.BN;
let CarRental = artifacts.require("CarRental");
let { catchRevert } = require("./exceptionsHelpers.js");
const { cars: CarStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("Car Rental", function (accounts) {
    const [_owner, alice, bob] = accounts;
    const emptyAddress = "0x0000000000000000000000000000000000000000";
  
    const deposit = "1000";
    const carName = "BMW";
    const uid = 001;
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
              "Struct Car should have a `name` member"
            );
            assert(
              isType(subjectStruct)("name")("string"), 
              "`name` should be of type `string`"
            );
          });

          it("should have a `deposit`", () => {
            assert(
              isDefined(subjectStruct)("deposit"), 
              "Struct Car should have a `deposit` member"
            );
            assert(
              isType(subjectStruct)("deposit")("uint"), 
              "`deposit` should be of type `uint`"
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

          it("should have a `duration`", () => {
            assert(
              isDefined(subjectStruct)("duration"), 
              "Struct Car should have a `duration` member"
            );
            assert(
              isType(subjectStruct)("duration")("uint"), 
              "`duration` should be of type `uint`"
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
    
          it("should have a `renter`", () => {
            assert(
              isDefined(subjectStruct)("renter"), 
              "Struct Car should have a `renter` member"
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
              "Struct Car should have a `owner` member"
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
        it("should add a new Car with CarName, Deposit and Uid", async () => {
          await instance.addNewCar(carName, deposit, uid, { from: alice });
    
          const result = await instance.fetchCar.call(001);
          assert.equal(
            result[0],
            carName,
            "the carName of the last added Car does not match the expected value",
          );
        
        });
    
      });
    
  });