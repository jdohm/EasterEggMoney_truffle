//based on https://github.com/dappuniversity/eth-todo-list by dapp university
//import {EasterEggMoney} from 'EasterEggMoney';

let web3;
let eem;
let easterEggMoney;
let netId;
let acc1;

App = {
  loading: false,
  contracts: {},

  load: async () => {
      await App.loadWeb3();
      //await App.loadAccount();
      //await App.loadContract();
      await App.render();
  },

  loadWeb3: async () => {
      if(typeof window.ethereum!=='undefined'){
          web3 = new Web3(window.ethereum);
          netId = await web3.eth.net.getId();
          const accounts = await web3.eth.getAccounts();

          if(typeof accounts[0] !== 'undefined'){
              const balance = await web3.eth.getBalance(accounts[0]);
              acc1 = accounts[0];
          }

          easterEggMoney = await $.getJSON('EasterEggMoney.json');
          eem = new web3.eth.Contract(easterEggMoney.abi, easterEggMoney.networks[netId].address);
      }
        else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
        return;
    }

    // Update app loading state
      App.setLoading(true);


      // show pricepool
      console.log(easterEggMoney.networks[netId].address);
      let usd = await web3.eth.getBalance(easterEggMoney.networks[netId].address);
      $('#xDai-value').html(web3.utils.fromWei(usd));
      console.log("usd " + web3.utils.fromWei(usd));

      // const findercount = await App.todoList.findersCount();
      const findersC = await eem.methods.findersCount().call({from: acc1});
      console.log("already found by " + findersC);
      $('#findersCount').html(String(findersC));
      $('#contractAddr').html(easterEggMoney.networks[netId].address);


    // Update loading state
      App.setLoading(false);
  },

  setLoading: (boolean) => {
      App.loading = boolean;
  },

    redeem: async () => {
        //App.todoList.defaultAccount = await web3.eth.accounts[0];
        const _pw = $('#password').val();
        console.log("default account: " + acc1);
        console.log("pw: " + _pw);
        const tmp = await eem.methods.find(_pw).send({from: acc1});
    },

    reset: async () => {
        //App.todoList.defaultAccount = await web3.eth.accounts[0];
        const _pw = '0x' + $('#password').val();
        console.log("default account: " + acc1);
        console.log("pw: " + _pw);
        const tmp = await eem.methods.updatepw(_pw).send({from: acc1});
    }
}

$(() => {
  $(window).load(() => {
      App.load();
  })
})
