// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


contract MarketFactory {



    address payable[] public deployedLabourMarkets;
    address payable[] public deployedPhysicalMarkets;

    function createLabourMarket() public {
        address newMarket = address(new LabourMarket(msg.sender));
        deployedLabourMarkets.push(payable(newMarket));
    }

     function createPhysicalMarket() public {
        address newMarket = address(new PhysicalMarket(msg.sender));
        deployedPhysicalMarkets.push(payable(newMarket));
    }



    function getDeployedLabourMarkets() public view returns (address payable[] memory) {
        return deployedLabourMarkets;
    }

    function getDeployedPhysicalMarkets() public view returns (address payable[] memory) {
        return deployedPhysicalMarkets;
    }

}

contract LabourMarket {

    struct Service{
        string description;
        uint value;
        bool availability;

    }

    struct ServiceRequest{
        uint serviceType;
        bool complete;
        uint requestTime;
        address buyer;
    }

    Service[] public serviceTypes;
    ServiceRequest[] public services;

    bool available;
    uint penalty;

    address public seller;
    mapping(address => uint) serviceBought;

    mapping(uint => uint) sellerOTP;
    mapping(uint => uint) buyerOTP;


    modifier availability(){
        require(available == true);
        _;
    }

    modifier restricted() {
        require(msg.sender == seller);
        _;
    }



    constructor (address creator) public {
        seller = creator;
        available = true;
        penalty = 100000000000000; // in ether = 0.0001
    }

    function createService(string memory description, uint value) public restricted{
        Service storage newService = serviceTypes.push();

        newService.description = description;
        newService.value = value;
        newService.availability = true;
    }

    function buyService(uint serviceIndex) public payable availability{

        ServiceRequest storage service = services.push();
        Service storage serviceType = serviceTypes[serviceIndex];

        require(msg.value == serviceType.value);

        service.requestTime = block.timestamp;
        service.serviceType = serviceIndex;
        service.buyer = msg.sender;
        service.complete = false;

        sellerOTP[service.requestTime] = uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,
 msg.sender))) % 1000;

        buyerOTP[service.requestTime] = uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,
 msg.sender))) % 1000;

    }

    function cancelRequestSeller(uint index) public payable restricted {
        ServiceRequest storage service = services[index];
        Service storage serviceType = serviceTypes[service.serviceType];

        service.complete = true;
        serviceType.availability = true;

        if(block.timestamp < service.requestTime + 30 minutes){

            payable(service.buyer).transfer(serviceType.value);
            payable(seller).transfer(msg.value);
        }
        else {
            payable(service.buyer).transfer(serviceType.value + msg.value);
        }

    }

    function cancelServiceBuyer(uint index) public payable{
        ServiceRequest storage service = services[index];
        Service storage serviceType = serviceTypes[service.serviceType];

        require(msg.sender == service.buyer);

        service.complete = true;
        serviceType.availability = true;

        if(block.timestamp < service.requestTime + 30 minutes){
            payable(service.buyer).transfer(serviceType.value + msg.value);
        }
        else {
            payable(seller).transfer(msg.value);
            payable(service.buyer).transfer(serviceType.value);
        }
    }

    function sellerApproval(uint index,uint sellOTP,uint buyOTP) public restricted{
        ServiceRequest storage service = services[index];

        require(sellerOTP[service.requestTime] == sellOTP && buyerOTP[service.requestTime] == buyOTP);

        service.complete = true;

        Service storage serviceType = serviceTypes[service.serviceType];

        payable(seller).transfer(serviceType.value);
        serviceType.availability = true;



    }


}

contract PhysicalMarket {
    address public Seller;

    constructor (address creator) public {
        Seller = creator;
    }
}
