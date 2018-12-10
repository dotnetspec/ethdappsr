module.exports = {
  // default applies to all enviroments
  default: {
    // rpc to deploy the contracts
    deployment: {
      host: "localhost",
      port: 8545,
      type: "rpc"
    },
    // order of connections the dapp should connect to
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545"

      //"$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ],
    contracts: {

      // DSportRank: {
      //   address: "0x3Ff27C3Da0978Ae39D6f5354B762186f27f78900",
      //   args: [ ]
      // }
    },
    gas: "auto",
    gasLimit: 9000000,
    gasPrice: 100
  },

  // ...

    // development: {
    //   dappConnection: [
    //     "ws://localhost:8546",
    //     "http://localhost:8545",
    //     "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    //   ]
    // }

  development: {
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ],
    contracts: {
      DSportRank: {
        address: "0x90305Ee2083d9B0013524dF287639e9Fd1E8Bc17"
                }
              },
    gas: "auto",
    gasLimit: 9000000,
    gasPrice: 100
  },

  testnet: {
    deployment:{
      // accounts: [
      //   {
      //     "mnemonic": "wave pigeon sustain sock boring monitor left sight hedgehog weapon champion session",
      //     "addressIndex": "0", // Optional. The index to start getting the address
      //     "numAddresses": "2", // Optional. The number of addresses to get
      //     "hdpath": "m/44'/60'/0'/0/" // Optional. HD derivation path
      //   }
      // ],
      accounts: [
        {
          "mnemonic": "acquire hole quarter security auto wedding leader audit baby dawn gravity obvious",
          "addressIndex": "0", // Optional. The index to start getting the address
          "numAddresses": "2", // Optional. The number of addresses to get
          "hdpath": "m/44'/60'/0'/0/" // Optional. HD derivation path
        }
      ],
      contracts: {
        // DSportRank: {
        //   address: "0x3Ff27C3Da0978Ae39D6f5354B762186f27f78900",
        //   args: [ ]
        // }
      },
      gasLimit: 9000000,
      gasPrice: 91200,
      host: "rinkeby.infura.io/nmY8WtT4QfEwz2S7wTbl",
      port: false,
      protocol: 'https',
      type: "rpc"
    }
  }
}
