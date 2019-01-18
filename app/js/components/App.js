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
    //cb from createuser.js to set the username
    //in time for getNewRankingID() to put it in the json
    export function userNameCB(userNameCB) {
      console.log('in userNameCB', userNameCB)
        this.setState({userNameCB})
    }

    //cb from GlobalRankings.js to set the rank id  selected by the user
    export function newrankIdCB(newrankIdCB) {
      console.log('in newrankIdCB', newrankIdCB)
        this.setState({newrankIdCB})
    }

    //cb from GlobalRankings.js to set the rank state as view only
    export function viewingOnlyCB(viewingOnlyCB) {
      console.log('in viewingOnlyCB', viewingOnlyCB)
        this.setState({viewingOnlyCB})
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
      challenges: [],
      newrankId: '',
      //rankingDefault is the global ranking list json
      rankingDefault: '5c36f5422c87fa27306acb52',
      userNameCB: '',
      loadingRankingListJSON: true,
      rankingListData: [],
      newrankIdCB:'',
      viewingOnlyCB: true,
      contactno: '',
      email: '',
      description:''
    }

    //bind the callback functions
    updatedExtAcctBalCB = updatedExtAcctBalCB.bind(this);
    contactNoCB = contactNoCB.bind(this);
    emailCB = emailCB.bind(this);
    userNameCB = userNameCB.bind(this);
    //click List All Rankings and Enter to reset the default ranking to display
    newrankIdCB = newrankIdCB.bind(this);
    viewingOnlyCB = viewingOnlyCB.bind(this);
  }
  //#endregion

  //#region Helper methods
  //_loadsetJSONData being used here and not in JSONops because of need to setState
_loadsetJSONData = async () => {
  try {
    //this.setState({ isLoading: true });
    // console.log('this.state.usersRankingLists')
    // console.log(this.state.usersRankingLists)
    //let httpStr = 'https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest';
  //   if(this.state.rankingDefault === ''){
  //   httpStr = 'https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest';
  // }else{
  //NB: below used to be rankingDefault - logic may still exist that uses it ...
  //let httpStr = 'https://api.jsonbin.io/b/' + this.state.newrankId + '/latest';
  let httpStr = 'https://api.jsonbin.io/b/' + this.state.newrankIdCB + '/latest';
    //let httpStr = 'https://api.jsonbin.io/b/' + this.state.rankingDefault + '/latest';
  //}
  let responseDataAsArray = [];
  console.log('httpStr', httpStr)
  await fetch(httpStr)
  //await fetch('https://api.jsonbin.io/b/' + httpStr + '/latest')
    //await fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/1000')
     .then((response) => response.json())
     .then((responseJson) => {
       //responseJson = JSON.parse(responseJson);
       //responseJson = '[' + responseJson +']';
       //console.log('responseJson', responseJson)
       //responseJson = JSON.parse(responseJson);
       if(responseJson.length != 0){
         console.log('json returns with length ' + responseJson.length + 'in _loadsetJSONData in app.js')
         console.log('responseJson data', responseJson)
         //HACK: it appears this code is not being used but commit
         // made as new rankings are being created for new users without error
         //on creation of a new user the [] isn't recognized
         //although the new json object comes back BootstrapTable
         //cannot handle it.
         //So convert here:
         if(responseJson.length === undefined){
           //turn the object into an array for use by BSTable
           //responseJson = "[" + responseJson + "]";
           responseDataAsArray[0] = responseJson;
           responseJson = responseDataAsArray;
           console.log('responseJson converted to array', responseJson)
         }
         //responseDataAsArray[0] = responseJson;
         //console.log('responseJson data as array', responseDataAsArray)
         //console.log(responseJson[0])
         // const temprankid = JSONops.getIdNoFromJsonbinResponse(responseJson)
         // console.log('temprankid',temprankid)
             this.setState({
               data: responseJson,
               //data: responseDataAsArray,
               //REVIEW: loadingJSON not currently being used
               loadingJSON: false
               ,
               //NB: data in state is slow to keep up, use responseJson!
               isUserInJson: JSONops.isPlayerListedInJSON(responseJson, this.state.user.username),
               rank: JSONops._getUserValue(responseJson, this.state.user.username, "RANK"),
               updatedExtAcctBalCB: this._loadExternalBalance(),
               isCurrentUserActive: JSONops._getUserValue(responseJson, this.state.user.username, "ACTIVE"),
               //isRankingIDInvalid: JSONops.isRankingIDInvalid(responseJson[0])
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

//TODO: together with _loadsetJSONData need to refactor into single source for fetch code
_loadsetRankingListJSONData = async () => {
  try {
    //this.setState({ isLoading: true });
    // console.log('this.state.usersRankingLists')
    // console.log(this.state.usersRankingLists)
    //let httpStr = 'https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest';
  //   if(this.state.rankingDefault === ''){
  //   httpStr = 'https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest';
  // }else{
    let httpStr = 'https://api.jsonbin.io/b/' + this.state.rankingDefault + '/latest';
  //}
  let responseDataAsArray = [];
  console.log('httpStr', httpStr)
  await fetch(httpStr)
  //await fetch('https://api.jsonbin.io/b/' + httpStr + '/latest')
    //await fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/1000')
     .then((response) => response.json())
     .then((responseJson) => {
       //responseJson = JSON.parse(responseJson);
       //responseJson = '[' + responseJson +']';
       //console.log('responseJson', responseJson)
       //responseJson = JSON.parse(responseJson);
       if(responseJson.length != 0){
         console.log('json returns with length ' + responseJson.length)
         console.log('responseJson data', responseJson)
         //HACK: it appears this code is not being used but commit
         // made as new rankings are being created for new users without error
         //on creation of a new user the [] isn't recognized
         //although the new json object comes back BootstrapTable
         //cannot handle it.
         //So convert here:
         if(responseJson.length === undefined){
           //turn the object into an array for use by BSTable
           //responseJson = "[" + responseJson + "]";
           responseDataAsArray[0] = responseJson;
           responseJson = responseDataAsArray;
           console.log('responseJson converted to array', responseJson)
         }
         //responseDataAsArray[0] = responseJson;
         //console.log('responseJson data as array', responseDataAsArray)
         //console.log(responseJson[0])
         // const temprankid = JSONops.getIdNoFromJsonbinResponse(responseJson)
         // console.log('temprankid',temprankid)
             this.setState({
               rankingListData: responseJson
               //data: responseDataAsArray,
               //loadingRankingListJSON: false
               //,
               //NB: data in state is slow to keep up, use responseJson for future query ops ...
               //REVIEW: may need functionality similar to following in future:
               //updatedExtAcctBalCB: this._loadExternalBalance(),
               //isCurrentUserActive: JSONops._getUserValue(responseJson, this.state.user.username, "ACTIVE")
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
 * _loadCurrentUserAccounts is triggered by onAfterUserUpdate in e.g. createuser.js
 * because it is sent as a property to these components
 *
 * @returns {null}
 */

  _loadCurrentUserAccounts = async () => {
    console.log('_loadCurrentUserAccounts')
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
          // console.log('getting rankingList ')
          // const rankingList =  (DSportRank.methods.getRankingAt(0).call()
          // .then(
          // console.log(rankingList))
          // ).toString();
          console.log('_loadCurrentUserAccounts 3')
          if (user.username != ''){
          console.log('user.username', user.username)
          console.log('user.contactno', user.contactno)
          console.log('user.email', user.email)
          //console.log('rankingList', rankingList)
          console.log('user.creationDate', user.creationDate)
          console.log('user.description', user.description)
          console.log('user.rankingDefault', user.rankingDefault)
          //console.log('user.challenges', user.challenges)
        }

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
        }//end of try/catch within async function definition within await/map
      }//end of async function definition within await map
      , (err, userAccounts) => {
        if (err) return this._onError(err, 'App._loadCurrentUserAccounts');

        const defaultUserAccount = userAccounts.find((userAccount) => {
          return userAccount.address === web3.eth.defaultAccount;
        });
        //check that there is an existing default account user
        //before setting state, and if there isn't go to create
        if(defaultUserAccount.user.username === ''){
          this.setState({
          rankingDefault: '',
          isUserInJson: false,
          isCurrentUserActive:false });
          this.props.history.push('/create');
        }else{
        //console.log('ready to set state which will prompt re-render')
        this.setState({
          //rank: JSONops._getUserValue(this.state.data, this.state.user.username, "RANK"),
          //rankingDefault: defaultUserAccount.user.rankingDefault,
          //REVEIW: perhaps change the naming of rankingDefault as it may be confusing
          //now that it is set by the user selection in GlobalRankings not the default value
          // in the contract
          newrankId: defaultUserAccount.user.rankingDefault,
          isUserInJson: JSONops.isPlayerListedInJSON(this.state.data, this.state.user.username),
          isCurrentUserActive: JSONops._getUserValue(this.state.data, this.state.user.username, "ACTIVE")
        }) //end of the setState
      }//end of the if

//common setState
      this.setState({ userAccounts: userAccounts,
        user: defaultUserAccount.user,
        contactno: defaultUserAccount.user.contactno,
        email: defaultUserAccount.user.email,
        description: defaultUserAccount.user.description,
        account: web3.eth.defaultAccount,
        balance: defaultUserAccount.balance,
        //rank: JSONops._getUserValue(this.state.data, this.state.user.username, "RANK"),
        contactNoCB: '',
        emailCB: '',
        loadingAccounts: false,
        //newrankId must be cleared so a new one has to be regenerated for each account
        newrankId: '',
        viewingOnlyCB: true
      }) //end of the setState

        console.log('ready to _loadsetRankingListJSONData after a render')
        console.log('isUserInJson', this.state.isUserInJson)

        console.log('isCurrentUserActive', this.state.isCurrentUserActive)
        //json won't be loaded until there is at least a default ranking initially
        //otherwise we'll be going to createuser
        //if(this.state.rankingDefault != ''){
          //REVIEW: possibly use JSONops._loadsetJSONData here if
          //will allow setState here
        //this._loadsetJSONData();
        console.log('this.state.newrankIdCB', this.state.newrankIdCB)
        if(this.state.newrankIdCB === ''){
        console.log('about to run _loadsetRankingListJSONData')
        this._loadsetRankingListJSONData();
      }else{
        console.log('about to run _loadsetJSONData')
        this._loadsetJSONData();
      }
        //get a new rankid ready in case user wants/needs to create a new ranking
        //do this after _loadsetJSONData so that we will already have the correct username
        //this.getNewRankId();
      //  }
      //}

        //this.getNewRankId();
      });////end of error check and account assignment within whole of await map
      console.log('end of loadingAccounts')
      console.log('this.state.loadingAccounts',this.state.loadingAccounts)
  }// end of _loadCurrentUserAccounts

  //TODO:add code to get from jsonbin.io
  //we are using this and not JSONops because we need to set state here
  getNewRankId = async () => {
    console.log('userNameCB in getNewRankId in app', this.state.userNameCB)
      try{
      this.setState({ isLoading: true});
      let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
          //this async section tests whether the result
          //from the code lower down has been returned
          //(without using await)
          if (req.readyState == XMLHttpRequest.DONE) {
            const resulttxt = JSON.parse(req.responseText);
            //only here can set state (once result is back)
            this.setState({ newrankId: resulttxt.id});
            console.log("this.state.newrankId", this.state.newrankId)
            //this.setState({ ranknameHasChanged: true});
            this.setState({ isLoading: false});
            // console.log('this.state.rankId')
            // console.log(this.state.rankId)
          }
        };
        //NB: following will send the request but
        //need to wait for the results to come back
        //(above) before any further processing can be
        //don

        var obj = {
        DATESTAMP: Date.now(),
        ACTIVE: true,
        DESCRIPTION: this.state.description,
        CURRENTCHALLENGERNAME: "AVAILABLE",
        CURRENTCHALLENGERID: 0,
        ACCOUNT: this.state.account,
        EMAIL: this.state.emai,
        CONTACTNO: this.state.contactno,
        RANK: 1,
        NAME: this.state.user,
        id: 1 };

        let myJSON = JSON.stringify(obj);
        console.log('getNewRankId using myJSON', myJSON)

        req.open("POST", "https://api.jsonbin.io/b", true);
        //req.open("PUT", "https://api.jsonbin.io/b", true);
        req.setRequestHeader("Content-type", "application/json");
        //req.send('{"Player": "Johan Straus"}') || {}
        req.send(myJSON) || {}
        }catch (err) {
        // stop loading state and show the error
        console.log(err)
        this.setState({ isLoading: false, error: err.message });
      };
        return null;
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
    console.log('this.state.user.username in componentDidMount in app', this.state.user.username)
    if(this.state.user.username != undefined){
    this.getNewRankId();
    }
  }

  // componentWillReceiveProps(nextProps){
  //   this.setState({data: nextProps.data})
  // }

//necessary to compare the states userNameCB so that the
//player name is only added to the json once we know what it is from
//the user create form
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate in app')
    //this.getNewRankId();
  // only do something if the data has changed
  // if (prevState.userNameCB !== this.state.userNameCB) {
  //   console.log('ready to do soemthing')
  //   this.getNewRankId();
  // }
}

  render() {

  console.log('rendering now in app render()')
  if(!this.state.isLoading){
    console.log('this.state.loadingAccounts in app render()', this.state.loadingAccounts)

  console.log('rank in app render()', this.state.rank)

  console.log('this.state.updatedExtAcctBalCB in app render()', this.state.updatedExtAcctBalCB)

  console.log('this.state.isUserInJson in app render()', this.state.isUserInJson)

  console.log('this.state.isCurrentUserActive in app render()',this.state.isCurrentUserActive)


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
          rankingDefault={this.state.rankingDefault}
          newrankId={this.state.newrankId}
          newrankIdCB={this.state.newrankIdCB}
          />
        <Main
          user={this.state.user}
          contactno={this.state.contactno}
          email={this.state.email}
          description={this.state.description}
          account={this.state.account}
          userAccounts={this.state.userAccounts}
          error={this.state.error}
          onAfterUserUpdate={(e) => this._loadCurrentUserAccounts()}
          onError={(err, source) => this._onError(err, source)}
          rankingJSONdata={this.state.data}
          rankingListJSONdata={this.state.rankingListData}
          updatedExtAcctBalCB={this.state.updatedExtAcctBalCB}
          contactNoCB={this.state.contactNoCB}
          emailCB={this.state.emailCB}
          rank={this.state.rank}
          isCurrentUserActive={this.state.isCurrentUserActive}
          isRankingIDInvalid={this.state.isRankingIDInvalid}
          newrankId={this.state.newrankId}
          rankingDefault={this.state.rankingDefault}
          getNewRankingID={(e) => this.getNewRankId()}
          newrankIdCB={this.state.newrankIdCB}
          viewingOnlyCB={this.state.viewingOnlyCB}
          isUserInJson={this.state.isUserInJson}
          loadingJSON={this.state.loadingJSON}
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
