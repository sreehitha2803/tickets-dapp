// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Tickets {
    uint256 constant TOTAL_TICKETS = 10;
    address public owner;

    struct Ticket {
        uint256 id;
        uint256 price;
        address owner; 
        bool purchased; 
    }

    Ticket[TOTAL_TICKETS] public tickets;

    constructor() {
        owner = msg.sender; 
        for (uint256 i = 0; i < TOTAL_TICKETS; i++) {
            tickets[i].id = i;
            tickets[i].price = 1 ether / 10;
            tickets[i].owner = address(0);
            tickets[i].purchased = false;
        }
    }

    function buyTicket(uint256 ticketId) public payable {
        require(msg.value == tickets[ticketId].price, "Incorrect Ether sent");
        require(tickets[ticketId].owner == address(0), "Ticket already sold");
        tickets[ticketId].owner = msg.sender;
        tickets[ticketId].purchased = true; 

    }

    function getTicket(uint256 ticketId) public view returns (uint256, uint256, address, bool) {
        Ticket memory ticket = tickets[ticketId];
        return (ticket.id, ticket.price, ticket.owner, ticket.purchased); 
    }
}
