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
 let globalVardevAccountBalResult = 0;

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

//Callback function, called in DoChallenge.js and used by Header.js to update the external account
//balance state
    export function updatedExtAcctBalCB(updatedExtAcctBalCB) {
        this.setState({updatedExtAcctBalCB})
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
      //data: JSONops._loadsetJSONData(),
      //rank: 0,
      updatedExtAcctBalCB: 0,
      isLoading: true
    }
    this._loadsetJSONData();
    //this._getUserRank();
    //this._simplefunct();

    //bind the callback function
    updatedExtAcctBalCB = updatedExtAcctBalCB.bind(this);

  }
  //#endregion



  //#region Helper methods

//TODO; any way to ge this into JSONops?
//problem is setting data: in state of this component
_loadsetJSONData(){

  //NOTE: it is the api.jsonbin NOT the jsonbin.io!
  //JSON data can and should be in ANY order
  //bin id is: https://jsonbin.io/5bd82af2baccb064c0bdc92a/
  fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest')
  //TODO: get it working with ipfs/swarm
  //fetch('http://localhost:8080/ipfs/QmXthCeahQiqDecUWPYB8VJEXCn6YNpLv9xcAgt8hhUdE2/Rankings.json')
  .then((response) => response.json())
  .then((responseJson) => {
    console.log('globalVardevAccountBalResult')
    console.log(globalVardevAccountBalResult)
    console.log('responseJson')
    console.log(responseJson)

    //if(globalVardevAccountBalResult > 0 && responseJson != null){
          this.setState({
            data: responseJson
            // ,
            // updatedExtAcctBalCB: globalVardevAccountBalResult,
            // isLoading: false
          }
      , function(){
      //console.log(responseJson);
          });
    //  }
  })
  .catch((error) => {
    console.error(error);
  });
}

// {Object.keys(this.props.rankingJSONdata).map(key => (
// <UserPlayerJsonData key={key} details={this.props.rankingJSONdata[key]} username={this.props.user}/>
// ))}
// _simplefunct(){
// //const jsondata = this.state.data;
// const user = this.state.user;
//   console.log(this.state.user);
// }


//REVIEW: Possible to getUserRank in App.js (and set state) rather than Home.js?
//currently no - problem is waiting for username to check against rank
// _getUserRank(){
//   const jsondata = this.state.data;
// //  const username = this.state.user;
//   console.log(jsondata);
//   console.log(this.state.user);
//   var arr = [];
//   Object.keys(jsondata).forEach(function(key) {
//     //console.log(key);
//     if (jsondata[key].NAME === this.state.user){
//      arr.push(jsondata[key]);
//     }
//    });
//    console.log(arr[0].RANK);
//    return arr[0].RANK;
// }

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

    //this.setState({ isLoading: true });

      // get all the accounts the node controls
      const accounts = await web3.eth.getAccounts();

      // Generates a mapping of users and accounts to be used
      // for populating the accounts dropdown
      await map(accounts, async function (address, next) {
        try {
          // get the owner details for this address from the contract
          const usernameHash = await DSportRank.methods.owners(address).call();

          // get user details from contract
          const user = await DSportRank.methods.users(usernameHash).call();


          // gets the balance of the address
          let balance = await web3.eth.getBalance(address);
          balance = web3.utils.fromWei(balance, 'ether');

//this.setState({ isLoading: false });


          // this.setState({
          //   updatedExtAcctBalCB: devAccountBalResult
          // });

          //devAccountTemp = devAccountBal;

          //get the user's ranking
          //const userRank = await this._getUserRank(user);

          // update user picture with ipfs url
          user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

          // add the following mapping to our result
          next(null, {
            address: address,
            user: user,
            balance: balance,
            //NB: added by me:
            updatedExtAcctBalCB: globalVardevAccountBalResult
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

        //const userrank = await this._getUserRank();

        this.setState({
          userAccounts: userAccounts,
          user: defaultUserAccount.user,
          account: web3.eth.defaultAccount,
          balance: defaultUserAccount.balance
          //,
          //updatedExtAcctBalCB: devAccountBalResult
          //,
        });
      });
  }

  _loadExternalBalance = async () => {

    this.setState({ isLoading: true });

    try {

    let devAccountBalResult = await web3.eth.getBalance("0xd496e890fcaa0b8453abb17c061003acb3bcc28e");
    devAccountBalResult = web3.utils.fromWei(devAccountBalResult, 'ether');
    globalVardevAccountBalResult =  formatEth(devAccountBalResult, 3)

    console.log('globalVardevAccountBalResult')
    console.log(globalVardevAccountBalResult)

    this.setState({
      updatedExtAcctBalCB: devAccountBalResult
    });
    this.setState({ isLoading: false });
    return globalVardevAccountBalResult;

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
  componentDidMount() {
    EmbarkJS.onReady(() => {
      setTimeout(() => { this._loadCurrentUserAccounts(); }, 0);
      setTimeout(() => { this._loadExternalBalance(); }, 0);
    });

    console.log('this.state.updatedExtAcctBalCB')
    console.log(this.state.updatedExtAcctBalCB)
  }

//rank is now obtained by the UserPlayerJsonData component
  // getUserRank(){
  //   return JSONops._getUserValue(this.state.data, this.state.user.username, 'RANK')
  // }

  render() {
    // console.log('this.state.user in didmount')
    // console.log(this.state.user)
    // console.log(JSONops._getUserValue(this.state.data, this.state.user.username, 'RANK'));
if(!this.state.isLoading){
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
          />
        <Main
          user={this.state.user}
          account={this.state.account}
          userAccounts={this.state.userAccounts}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUserAccounts()}
          onError={(err, source) => this._onError(err, source)}
          rankingJSONdata={this.state.data}
          currentDevETHBal={this.state.updatedExtAcctBalCB}
          //rank={this.getUserRank()}
          />
      </div>
    );
  }else{
    return (
    <div>...loading</div>
  );
  }

  }
  //#endregion
}

export default withRouter(App)
