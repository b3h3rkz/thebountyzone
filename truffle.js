var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "maximum spare dilemma rubber jaguar verify praise impact thought safe isolate profit";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    // azure: {
    //   provider: new HDWalletProvider(mnemonic, "http://customRPC:8545"),
    //   network_id: "56652",
    //   gas: 4612388,
    //   from: fromAddress
    // },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/")
      },
      network_id: 3,
      gas: 4700000, // Gas limit used for deploys
      gasPrice: 4000000000

    }   
    // rinkeby: {
    //   provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/access_token"),
    //   network_id: "4",
    //   gas: 4612388,
    //   from: fromAddress
    // },
    // kovan: {
    //   provider: new HDWalletProvider(mnemonic, "https://kovan.infura.io/access_token"),
    //   network_id: "42",
    //   gas: 4612388,
    //   from: fromAddress
    // }
  }
};