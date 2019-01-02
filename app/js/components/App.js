import Header from './Header'
import Main from './Main'
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import imgAvatar from '../../img/avatar-default.png';
import { map } from 'async';
import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
//import axios from 'axios'
import JSONops from './JSONops'
import { formatEth, limitLength, limitAddressLength } from '../utils';
//import jsonData from '../../json/Rankings.json'

//REVIEW: Global variable
//currently only assigned when click challenge... button
 //let currentUserRank = 0;
 //devAccountTemp used to avoid 'callback' errors
 //let globalVardevAccountBalResult = 0;

 //REVIEW: Possibly unnecessary re-rendering
 //only used to get the player rank
// class UserPlayerJsonData extends Component {
//    render() {
//       // details is all the object -> array data coming from the data prop sent from Home
//       //using the object.keys code
//         const { details } = this.props;
//         //console.log(details.RANK);
//           if (details.NAME === this.props.username)
//     {
//       console.log(details.RANK);
//       currentUserRank = details.RANK;
//
//       return (
//         <div>
//           {details.RANK}
//        </div>);
//      }else{return (null)
//        ;}
//    }
// }

//Callback functions:
//called in DoChallenge.js and used by Header.js to update the external account
//balance state
    export function updatedExtAcctBalCB(updatedExtAcctBalCB) {
        this.setState({updatedExtAcctBalCB})
    }
    //these cb functions update the relevant components
    //DoChallenge.js
    export function contactNoCB(contactNoCB) {
        this.setState({contactNoCB})
    }
    export function emailCB(emailCB) {
        this.setState({emailCB})
    }
    //cb functions based on the data in the json
    export function jsonHasRankingID(jsonHasRankingID) {
        this.setState({jsonHasRankingID})
    }
    export function jsonHasData(jsonHasData) {
        this.setState({jsonHasData})
    }
    export function currentUserRank(currentUserRank) {
        this.setState({currentUserRank})
    }
/**
 * Class representing the highest order component. Any user
 * updates in child components should trigger an event in this
 * class so that the current user details can be re-fetched from
 * the contract and propagated to all children that rely on it
 *
 * @extends React.Component
 */
class App extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      account: '',
      error: {},
      userAccounts: [],
      balance: 0,
      data: [],
      currentUserRank: 0,
      updatedExtAcctBalCB: 0,
      isLoading: true,
      contactNoCB:'',
      emailCB:'',
      usersRankingLists: [],
      isUserInJson: false,
      jsonHasRankingID: false,
      jsonHasData: false,
      test: [],
      loadingAccounts: true,
      loadingJSON: true,
      loadingExtBal: true,
      isCurrentUserActive: false,
      isRankingIDInvalid: false,
      challenges: []
    }

    //bind the callback functions
    updatedExtAcctBalCB = updatedExtAcctBalCB.bind(this);
    contactNoCB = contactNoCB.bind(this);
    emailCB = emailCB.bind(this);
  }
  //#endregion

  //#region Helper methods
_loadsetJSONData = async () => {
  try {
    //this.setState({ isLoading: true });
    await fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest')
    //await fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/1000')
     .then((response) => response.json())
     .then((responseJson) => {
       if(responseJson.length != 0){
         console.log('json returns with length ' + responseJson.length)
         console.log('responseJson data')
         console.log(responseJson[0])
             this.setState({
               data: responseJson,
               loadingJSON: false
               ,
               //NB: data in state is slow to keep up, use responseJson!
               isUserInJson: JSONops.isPlayerListedInJSON(responseJson, this.state.user.username),
               rank: JSONops._getUserValue(responseJson, this.state.user.username, "RANK"),
               updatedExtAcctBalCB: this._loadExternalBalance(),
               isCurrentUserActive: JSONops._getUserValue(responseJson, this.state.user.username, "ACTIVE"),
               isRankingIDInvalid: JSONops.isRankingIDInvalid(responseJson[0])
             }
         , function(){
             });
           }
     })
  //REVIEW:
  //this.setState({ isLoading: false });
  //the 'return' is not important, the setState is
  return null;
}catch (err) {
     return console.error(err);
  }
}
//REVIEW: Possible to getUserRank in App.js (and set state) rather than Home.js?
//currently no - problem is waiting for username to check against rank
/**
 * Loads user details from the contract for all accounts on the node.
 *
 * For each account on the node, first, the owners mapping is queried using the
 * owner address key. It returns the hash of the username it maps to. This
 * username hash is then used to query the users mapping in the contract to
 * get the details of the user. Once the user details are returned, the state
 * is updated with the details, which triggers a render in this component and
 * all child components.
 *
 * @returns {null}
 */

  _loadCurrentUserAccounts = async () => {

    //console.log('_loadCurrentUserAccounts')

      // get all the accounts the node controls
      const accounts = await web3.eth.getAccounts();

        //console.log('_loadCurrentUserAccounts 1')

      // Generates a mapping of users and accounts to be used
      // for populating the accounts dropdown
      await map(accounts, async function (address, next) {
        try {
          //console.log('_loadCurrentUserAccounts 2')
          // get the owner details for this address from the contract
          const usernameHash = await DSportRank.methods.owners(address).call();
          // console.log('_loadCurrentUserAccounts 2')
          // console.log(usernameHash)
          // get user details from contract
          const user = await DSportRank.methods.users(usernameHash).call();
          // console.log('_loadCurrentUserAccounts 3')
          // console.log(user.username)

          // gets the balance of the address
          let balance = await web3.eth.getBalance(address);
          balance = web3.utils.fromWei(balance, 'ether');

          // update user picture with ipfs url
          user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

          // console.log('this.state.isLoading 1')
          // console.log('this.state.loadingAccounts')
          //console.log(this.state.loadingAccounts)
          //console.log(this.state.isLoading)
          //console.log('this.state.isLoading 2')

          // add the following mapping to our result
          next(null, {
            address: address,
            user: user,
            balance: balance
            //,
            //NB: added by me:
            //updatedExtAcctBalCB: globalVardevAccountBalResult
          });
        }
        catch (err) {
          next(err);
        }
      }, (err, userAccounts) => {
        if (err) return this._onError(err, 'App._loadCurrentUserAccounts');

        const defaultUserAccount = userAccounts.find((userAccount) => {
          return userAccount.address === web3.eth.defaultAccount;
        });
        //check that there is an existing default account user
        //before setting state
        if(defaultUserAccount.user.username === ''){
          //this.setState({ error: err });
          this.props.history.push('/create');
        }
        //console.log('ready to set state which will prompt re-render')
        this.setState({
          userAccounts: userAccounts,
          user: defaultUserAccount.user,
          account: web3.eth.defaultAccount,
          balance: defaultUserAccount.balance,
          //rank: JSONops._getUserValue(this.state.data, this.state.user.username, "RANK"),
          contactNoCB: '',
          emailCB: ''
          ,
          loadingAccounts: false,
          challenges: defaultUserAccount.user.challenges,
          usersRankingLists: defaultUserAccount.user.rankings
          // ,
          // data:
          //,
          //updatedExtAcctBalCB: devAccountBalResult
          //,
        });
        console.log('ready to _loadsetJSONData after a render')

        this._loadsetJSONData();
      });
      console.log('end of loadingAccounts')
      console.log('this.state.loadingAccounts')
      console.log(this.state.loadingAccounts)
  }

  /**
   * Originally based on _loadCurrentUserAccounts() (above)
   * Loads user's rankingLists from the contract.
   *
   * This only needs to be done for the currently active account,
   * first, the owners mapping is queried using the
   * owner address key. It returns the hash of the username it maps to. This
   * username hash is then used to query the users mapping in the contract to
   * get the rankingList of the user. Once the rankingList is returned, the state
   * is updated with the details, which triggers a render in this component and
   * all child components.
   *
   * @returns {null}
   */

    // _loadRankingLists = async () => {
    //
    //     // get all the accounts the node controls
    //     const accounts = await web3.eth.getAccounts();
    //
    //     // Generates a mapping of users and accounts to be used
    //     // for populating the accounts dropdown
    //     await map(accounts, async function (address, next) {
    //       try {
    //         // get the owner details for this address from the contract
    //         const usernameHash = await DSportRank.methods.owners(address).call();
    //
    //         // get user details from contract
    //         const user = await DSportRank.methods.users(usernameHash).call();
    //
    //         //get the user's RankingLists array
    //         //TODO: change to contract code:
    //         const usersRankingLists = await DSportRank.methods.rankingLists(usernameHash).call();
    //         //const usersRankingLists = ["5bd82af2baccb064c0bdc92a"];
    //         console.log(usersRankingLists)
    //
    //         // gets the balance of the address
    //         // let balance = await web3.eth.getBalance(address);
    //         // balance = web3.utils.fromWei(balance, 'ether');
    //
    //         // update user picture with ipfs url
    //         //user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
    //
    //         // add the following mapping to our result
    //         next(null, {
    //           address: address,
    //           user: user,
    //           rankingList: usersRankingLists
    //           // ,
    //           // usersRankingLists: usersRankingLists
    //         });
    //       }
    //       catch (err) {
    //         next(err);
    //       }
    //     }, (err, userAccounts) => {
    //       if (err) return this._onError(err, 'App._loadRankingLists');
    //
    //       const defaultUserAccount = userAccounts.find((userAccount) => {
    //         //return userAccount.address === web3.eth.defaultAccount;
    //         return usersRankingLists.rankingList;
    //       });
    //
    //       //const userrank = await this._getUserRank();
    //
    //       // this.setState({
    //       //   usersRankingLists: usersRankingLists
    //       // });
    //     });
    // }

//REVIEW: below based on
//https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8
//to a (small) degree - anyway it's a useful reference
  _loadExternalBalance = async () => {
    try {
    let devAccountBalResult = await web3.eth.getBalance("0xd496e890fcaa0b8453abb17c061003acb3bcc28e");
    devAccountBalResult = web3.utils.fromWei(devAccountBalResult, 'ether');
    devAccountBalResult =  formatEth(devAccountBalResult, 3);
    this.setState({
      updatedExtAcctBalCB: devAccountBalResult
    });
    this.setState({ loadingExtBal: false });
    this.setState({ isLoading: false });

    //the 'return' is not important, the setState is
    return devAccountBalResult;
    //REVIEW: don't know what this kind of return statement is currently
  }catch (err) {
        return {
            name: 'default user'
        };
    }
  }

  /**
   * Sets the App state error and redirects the user to the error page
   *
   * @param {Error} err - error encountered
   */
  _onError(err, source) {
    if (source) err.source = source;
    this.setState({ error: err });
    this.props.history.push('/whoopsie');
  }
  //#endregion

  //#region React lifecycle events
  //loading the network functions from here
  async componentDidMount() {
    EmbarkJS.onReady(() => {
      this._loadCurrentUserAccounts();
    });
  }

  render() {

  console.log('rendering now')
  if(!this.state.isLoading){
    console.log('this.state.loadingAccounts')
  console.log(this.state.loadingAccounts)
  console.log('rank')
  console.log(this.state.rank)
  console.log('this.state.updatedExtAcctBalCB')
  console.log(this.state.updatedExtAcctBalCB)
  console.log('this.state.isUserInJson')
  console.log(this.state.isUserInJson)
  console.log('this.state.isCurrentUserActive')
  console.log(this.state.isCurrentUserActive)

}
    return (
      <div>
        <Header
          user={this.state.user}
          account={this.state.account}
          userAccounts={this.state.userAccounts}
          balance={this.state.balance}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUserAccounts()}
          onError={(err, source) => this._onError(err, source)}
          rankingJSONdata={this.state.data}
          updatedExtAcctBalCB={this.state.updatedExtAcctBalCB}
          usersRankingLists={this.state.usersRankingLists}
          isUserInJson={this.state.isUserInJson}
          />
        <Main
          user={this.state.user}
          account={this.state.account}
          userAccounts={this.state.userAccounts}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUserAccounts()}
          onError={(err, source) => this._onError(err, source)}
          rankingJSONdata={this.state.data}
          updatedExtAcctBalCB={this.state.updatedExtAcctBalCB}
          contactNoCB={this.state.contactNoCB}
          emailCB={this.state.emailCB}
          rank={this.state.rank}
          isCurrentUserActive={this.state.isCurrentUserActive}
          isRankingIDInvalid={this.state.isRankingIDInvalid}
          />
      </div>
    );
  // }else{
  //   return (
  //   <div>...loading</div>
  // );
  // }

  }
  //#endregion
}

export default withRouter(App)
