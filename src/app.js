//based on https://github.com/dappuniversity/eth-todo-list by dapp university
App = {
  loading: false,
  contracts: {},

  load: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
        window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
          await ethereum.enable();
        // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
      App.account = web3.eth.accounts[0];
      // console.log("default account: " + App.account);
      // console.log("default account: " + web3.eth.accounts[0]);
      web3.eth.defaultAccount = web3.eth.accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
      const easterEggMoney = await $.getJSON('EasterEggMoney.json');
      App.contracts.TodoList = TruffleContract(easterEggMoney);
      App.contracts.TodoList.setProvider(App.web3Provider);

    // Hydrate the smart contract with values from the blockchain
      App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
        return;
    }

    // Update app loading state
      App.setLoading(true);


      // show pricepool
      web3.eth.getBalance(App.contracts.TodoList.address, (a,b) => {
          $('#xDai-value').html(b.toNumber()* 10**-18);
          console.log(a);
          console.log(b.toNumber()* 10**-18);
      });


      const findercount = await App.todoList.findersCount();
      $('#findersCount').html(String(findercount));
      // console.log("findersCount = " + await App.todoList.findersCount());
      $('#contractAddr').html(App.contracts.TodoList.address);


    // Update loading state
      App.setLoading(false);
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

    redeem: async () => {
        //App.todoList.defaultAccount = await web3.eth.accounts[0];
        const _pw = $('#password').val();
        console.log("default account: " + App.account);
        console.log("pw: " + _pw);
        let tmp = await App.todoList.find(_pw);
    }
}

$(() => {
  $(window).load(() => {
      App.load();
  })
})
