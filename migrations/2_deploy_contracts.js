const EasterEggMoney = artifacts.require("EasterEggMoney");
const _testpw = '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658';

module.exports = function(deployer) {
    deployer.deploy(EasterEggMoney, _testpw);
};
