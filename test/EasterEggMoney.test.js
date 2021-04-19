const eem = artifacts.require('./EasterEggMoney.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('EasterEggMoney', (accounts) =>{
    before(async() => {
        this.eem = await eem.deployed();
    });

    let address;

    it('deploys successfully', async () => {
        address = await this.eem.address;
        console.log(address);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    describe('test payments', () => {
        before(async () => {
            await this.eem.topup({value: 10**17, from: accounts[0]});
            await this.eem.sendTransaction({from: accounts[0], value: 3*10**16});
        });

        it('balance should increase', async () => {
            let balance = await web3.eth.getBalance(address);
            assert.equal(Number(balance), 13*10**16);
        });
    });

    describe('test loosers', () => {
        it('wrong password gets rejected', async () => {
            await this.eem.find("wrongPW");
            let balance = await web3.eth.getBalance(address);
            assert.equal(Number(balance), 13*10**16);
        });
    });

    describe('test winner', () => {
        it('right password gets rewarded', async () => {
            let ubalance = await web3.eth.getBalance(accounts[0]);
            await this.eem.find("test");
            let balance = await web3.eth.getBalance(address);
            let ubalanceafter = await web3.eth.getBalance(accounts[0]);
            assert.equal(Number(balance), 0);
            assert.isAbove(Number(ubalanceafter), Number(ubalance));
        });
    });
});
