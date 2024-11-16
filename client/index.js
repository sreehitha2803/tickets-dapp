import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import configurations from '../build/contracts/Tickets.json';
import Ticketimage from '../client/images/images.jpeg';

const createElementFromString = (string) => {
    const div = document.createElement('div');
    div.innerHTML = string.trim();
    return div.firstChild;
};

const buyTicket = async (ticket) => {
    try {
        await contract.methods.buyTicket(ticket.id).send({
            from: account,
            value: ticket.price,
        });
        await refreshtickets(); 
    } catch (error) {
        console.error("Error purchasing ticket:", error);
    }
};

const CONTRACT_ADDRESS = configurations.networks['5777'].address;
const CONTRACT_ABI = configurations.abi;

let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3('http://127.0.0.1:7545'); 
}

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
let account;
const accountEl = document.getElementById('accounts'); 
const ticketsEl = document.getElementById('tickets');

const TOTAL_TICKETS = 10;

const refreshtickets = async () => {
    if (ticketsEl) ticketsEl.innerHTML = ""; 

    for (let i = 0; i < TOTAL_TICKETS; i++) {
        try {
            const ticketData = await contract.methods.getTicket(i).call();
            const ticket = {
                id: ticketData[0],
                price: ticketData[1],
                owner: ticketData[2],
                purchased: ticketData[3],
            };

            if (!ticket.purchased) {
                const priceInEth = web3.utils.fromWei(ticket.price.toString(), 'ether');

                const ticketEl = createElementFromString(`
                    <div class="ticket" style="width: 18rem;  height: 15rem;">
                        <img src="${Ticketimage}" alt=" " class="card-image">
                        <div class="card-body">
                            <p class="card-text">${priceInEth} ETH</p>
                            <button href="#" class="card-link" data-id="${ticket.id}">Buy</button>
                        </div>
                    </div>
                `);

                const button = ticketEl.querySelector('button');
                button.onclick = () => buyTicket(ticket);

                ticketsEl.appendChild(ticketEl);
            }
        } catch (error) {
            console.error(`Error fetching ticket ${i}:`, error);
        }
    }
};

const main = async () => {
    try {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            if (accountEl) accountEl.innerText = `Connected: ${account}`; 
            await refreshtickets();
        } else {
            console.error("MetaMask is not installed. Please install it to continue.");
        }
    } catch (error) {
        console.error("Error requesting accounts:", error);
    }
};

main();
