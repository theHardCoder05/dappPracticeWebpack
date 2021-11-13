let BN = web3.utils.BN;
let CarRental = artifacts.require("CarRental");
let { catchRevert } = require("./exceptionsHelpers.js");
const { cars: CarStruct, isDefined, isPayable, isType } = require("./ast-helper");

contract("Car Rental", function (accounts) {
    const [_owner, alice, bob] = accounts;
    const emptyAddress = "0x0000000000000000000000000000000000000000";
  
    const price = 1000;
    const carName = "BMW";
    const uid = 001;
    const duration = 14;
    const year = 1807;
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
    
 
    // Unit test cases
    describe("Use cases", () => {
        it("should add a new Car with CarName, Price, Uid, Year", async () => {
          await instance.addNewCar(carName, price, uid, year, { from: alice });
    
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
    
  });