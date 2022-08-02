const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { waffle } = require("hardhat");
const provider = waffle.provider;

describe("Hotel", async function () {
  let Hotel;
  let hotel;
  let owner;
  let customer1;
  let customer2;
  let numberOfRooms;

  before(async function () {
    // Get the ContractFactory and Signers here.
    Hotel = await ethers.getContractFactory("Hotel");
    [owner, customer1, customer2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Hotel.deploy()
    // and wait for it to be deployed, which happens
    // once its transaction has been mined.
    hotel = await Hotel.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const contractOwner = await hotel.owner();
      expect(contractOwner).to.equal(owner.address);
    });
    it("Should not have any rooms available for booking", async function () {
      numberOfRooms = await hotel.numberOfRooms();
      expect(numberOfRooms).to.equal(0);
    });
  });
  describe("Testing the functions", function () {
    it("Should allow owner to add a room to the listings", async function () {
      const name = "Silver Room";
      const description = "9x7 Double bed | Wifi Access ";
      const price = "45000";

      // add a new room to the listings
      await hotel.addRoom(name, description, price);

      // check if there is a room in the listings
      numberOfRooms = await hotel.numberOfRooms();
      expect(numberOfRooms).to.equal(1);

      const firstRoom = await hotel.rooms(0);

      // check if the room was listed with the correct name
      expect(firstRoom.name).to.equal(name);

      // check if the room was listed with the correct description
      expect(firstRoom.description).to.equal(description);

      // check if the room was listed with the correct price
      expect(firstRoom.price).to.equal(price);
    });
    it("Should prevent an account that is not owner from adding room to the listings", async function () {
      const name = "Gold Room";
      const description =
        "Room and living room | Double Bed | Wifi Access | 2 flat screen TVs";
      const price = "60000";

      // add a new room to the listings
      await expect(
        hotel.connect(customer2).addRoom(name, description, price)
      ).to.be.revertedWith("Ownable: caller is not owner");
    });
    it("Should book a vacant room with sufficient funds", async function () {
      const roomId = 0;
      const nights = 2;

      // book room with roomId = 0
      await hotel.connect(customer1).bookRoom(roomId, nights, { value: 90000 });

      // staus of room should be occupied
      await hotel
        .rooms(roomId)
        .then((roomStatus) => {
          return roomStatus.currentStatus;
        })
        .then((currentStatus) => {
          expect(currentStatus).to.equal(1);
        });
    });
    it("Should revert if customer trys to book an occupied room", async function () {
      const roomId = 0;
      const nights = 4;

      // book room with roomId = 0
      await expect(
        hotel.connect(customer2).bookRoom(roomId, nights, { value: 180000 })
      ).to.be.revertedWith("room is already booked");
    });
    it("Should allow owner to add another room to the listings", async function () {
      const name = "Gold Plus Room";
      const description =
        "Room and living room | Double Bed | Wifi Access | Free breakfast | 2 flat screen TVs";
      const price = "80000";

      // add a new room to the listings
      await hotel.addRoom(name, description, price);

      // check if there is a room in the listings
      numberOfRooms = await hotel.numberOfRooms();
      expect(numberOfRooms).to.equal(2);

      const secondRoom = await hotel.rooms(1);
      // check if the room was listed with the correct name
      expect(secondRoom.name).to.equal(name);

      // check if the room was listed with the correct description
      expect(secondRoom.description).to.equal(description);

      // check if the room was listed with the correct price
      expect(secondRoom.price).to.equal(price);
    });
    it("Should revert if customer trys to book a vacant room with insufficient funds", async function () {
      const roomId = 1;
      const nights = 7;

      const ownerInitialEthBalance = await provider.getBalance(owner.address);

      // book room with roomId = 1
      await expect(
        hotel.connect(customer2).bookRoom(roomId, 7, { value: 65000 })
      ).to.be.reverted;

      // staus of room should remain vacant
      await hotel
        .rooms(roomId)
        .then((roomStatus) => {
          return roomStatus.currentStatus;
        })
        .then((currentStatus) => {
          expect(currentStatus).to.equal(0);
        });

      // owner ETH balance should remain the same
      const ownerNewEthBalance = await provider.getBalance(owner.address);
      expect(Number(ownerNewEthBalance)).to.equal(
        Number(ownerInitialEthBalance)
      );
    });
  });
});
