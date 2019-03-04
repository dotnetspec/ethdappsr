module.exports = {
  // default applies to all enviroments
  default: {
    // rpc to deploy the contracts
    deployment: {
      host: "localhost",
      port: 8546,
      type: "ws"
    },
    // order of connections the dapp should connect to
    dappConnection: [
      //"$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ],
    contracts: {
      DSportRank: {
        address: "0x99E7178ffE7Cb311719E6CF7201c10FA03dFB9ca",
        args: [ ]
      }
    },
    gas: "auto",
    gasLimit: 9000000,
    gasPrice: 100
  },

  // ...

    // development: {
    //   dappConnection: [
    //     "ws://localhost:8546",
    //     "http://localhost:8545",      password: "config/testnet/password"
  //   }
  // },
  infura: {
    enabled: true,
    networkType: "testnet",
    networkId: "4",
    light: true,
    rpcHost: "localhost",
    rpcPort: 8545,
    rpcCorsDomain: "http://localhost:8000",
    account: {
      password: "config/testnet/rinkeby_password"
    },
    dappConnection: [
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ],
    contracts: {
      DSportRank: {
        address: "0x0b7a9bf185d2266f81f64e8e0848ab66a1dd3cc5",
        args: [ ]
      }
    },
    deployment:{
      accounts: [
        {
          mnemonic: "blind vendor near grace hover video merit hint brave ticket man awkward"
        }
      ],
      host: "rinkeby.infura.io/964a8fdda64246719dc7ba8cbf301cc7",
      port: false,
      protocol: 'https',
      type: "rpc"
    }
  },

  livenet: {
    enabled: false,
    networkType: "livenet",
    //     "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    //   ]
    // }
},

  development: {
    contracts: {
      DSportRank: {
        address: "0x99E7178ffE7Cb311719E6CF7201c10FA03dFB9ca",
        args: [ ]
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
