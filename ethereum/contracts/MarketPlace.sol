// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


contract MarketFactory {




    address payable[] public deployedLabourMarkets;
    address payable[] public deployedPhysicalMarkets;

    mapping(address => address) public getLabourMarket;
    mapping(address => bool) public labourMarketOwned;
    mapping(address => bool) public physicalMarketOwned;
    mapping(address => address) public getPhysicalMarket;

    function createLabourMarket() public {
        require(!labourMarketOwned[msg.sender]);
        address newMarket = address(new LabourMarket(msg.sender));
        deployedLabourMarkets.push(payable(newMarket));
        getLabourMarket[msg.sender] = newMarket;
        labourMarketOwned[msg.sender] = true;
    }

     function createPhysicalMarket() public {
     require(!physicalMarketOwned[msg.sender]);
        address newMarket = address(new PhysicalMarket(msg.sender));
        deployedPhysicalMarkets.push(payable(newMarket));
        getPhysicalMarket[msg.sender] = newMarket;
        physicalMarketOwned[msg.sender] = true;
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
        string header;
        string description;
        uint value;
        bool availability;

    }

    struct ServiceRequest{
        uint serviceType;
        bool complete;
        uint requestTime;
        address buyer;

        bool buyerApprove;
    }

    Service[] public serviceTypes;
    ServiceRequest[] public services;

    bool available;
    uint penalty;

    address public seller;
    mapping(address => uint) serviceBought;





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

    function createService(string memory header,string memory description, uint value) public restricted{
        Service storage newService = serviceTypes.push();

        newService.header = header;
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
        serviceType.availability = false;
        serviceBought[msg.sender]=services.length;

      service.buyerApprove= false;

    }

    function cancelRequestSeller(uint index) public payable restricted {
        ServiceRequest storage service = services[index];
        Service storage serviceType = serviceTypes[service.serviceType];

        service.complete = true;
        serviceType.availability = true;
        service.buyerApprove = true;

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
        service.buyerApprove = true;

        if(block.timestamp < service.requestTime + 30 minutes){
            payable(service.buyer).transfer(serviceType.value + msg.value);
        }
        else {
            payable(seller).transfer(msg.value);
            payable(service.buyer).transfer(serviceType.value);
        }
    }


    function buyerApproval(uint index) public {
    ServiceRequest storage service = services[index];

    require(service.buyer == msg.sender);

    service.buyerApprove = true;
    }


    function sellerApproval(uint index) public restricted{
        ServiceRequest storage service = services[index];

        require(service.buyerApprove);


        service.complete = true;

        Service storage serviceType = serviceTypes[service.serviceType];

        payable(seller).transfer(serviceType.value);
        serviceType.availability = true;



    }



    function getServiceTypesCount() public view returns(uint) {
    return serviceTypes.length;
    }

    function getServiceCount() public view returns(uint) {
    return services.length;
    }


}

contract PhysicalMarket {
    address public seller;

    constructor (address creator) public {
        seller = creator;
    }
}
