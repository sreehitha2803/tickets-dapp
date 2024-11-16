var MyContract = artifacts.require("./Tickets.sol");
module.exports = async function (deployer) {
  			await deployer.deploy(MyContract);
};
