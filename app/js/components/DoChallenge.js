import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
//import testData from "../../json/Rankings.json";
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';
import Spinner from 'react-spinkit';

/**
 * Class that renders a form to allow the user to create
 * a challenge that is stored in the contract.
 *
 * @extends React.Component
 */

class DoChallenge extends Component{

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    const data = this.props.data;
    //original code before onAfterChallenge bound
    //const { username, account, onAfterChallenge } = this.props;
    const { username, account } = this.props;
    let onAfterChallenge = this.props.onAfterChallenge.bind(this);

    // initial state
    this.state = {
      selection: [],
      data,
      showModal: false,
      challenge: '',
      selectedOpponentName: "",
      challengeHasChanged: false,
      isLoading: false,
      error: '',
      selectedChallengeOption: 'No'
    };

    this.challengeInput = '';
  }
  //#endregion

  _updateJSON(currentUser, selectedOpponent){

    //REVIEW: using currentUser as lookupKey. May link to id in future

    console.log(currentUser);
    console.log(selectedOpponent);

    //use update objects to manage the json data
    //values are just placeholders until they get updated
    // let updateUserRank = {
    //   jsonRS: this.props.data,
    //   lookupField: "",
    //   lookupKey: 0,
    //   targetField: "",
    //   targetData: "",
    //   checkAllRows: false
    //   };

      let updateUserCURRENTCHALLENGERID = {
        jsonRS: this.props.data,
        lookupField: "",
        lookupKey: 0,
        targetField: "",
        targetData: "",
        checkAllRows: false
        };

        //TODO: change name to lookupandupdateOpponentID
      let lookupOpponentID = {
        jsonRS: this.props.data,
        lookupField: '',
        lookupKey: '',
        targetField: "CURRENTCHALLENGERID",
        targetData: "",
        checkAllRows: false
        };


//get the opponent's ID number
        lookupOpponentID.lookupField = "NAME";
        lookupOpponentID.lookupKey = selectedOpponent;
        lookupOpponentID.targetField = "id";
        //update the current user's challengeID to the selected opponent's ID
        //lookupOpponentID.targetData = selectedOpponentIDNumber;

    //find selectedOpponent's ID
    const selectedOpponentIDNumber = this._getVal(lookupOpponentID);
    console.log(selectedOpponentIDNumber);
    console.log(typeof selectedOpponentIDNumber);

    //TODO: change name to lookupandupdateUserID

    //get the user's id number

    updateUserCURRENTCHALLENGERID.lookupField = "NAME";
    updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
    updateUserCURRENTCHALLENGERID.targetField = "id";
    //update the current user's challengeID to the selected opponent's ID
    //lookupOpponentID.targetData = selectedOpponentIDNumber;

//find selectedOpponent's ID
const userIDNumber = this._getVal(updateUserCURRENTCHALLENGERID);
console.log(userIDNumber);
console.log(typeof userIDNumber);

    //update the User CURRENTCHALLENGERID field with the opponenet's id number
    updateUserCURRENTCHALLENGERID.lookupField = "NAME";
    updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
    updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERID";
    //update the current user's challengeID to the selected opponent's ID
    updateUserCURRENTCHALLENGERID.targetData = selectedOpponentIDNumber;
    //re-set user's CURRENTCHALLENGERID to 0
    // updateUser.targetField = "CURRENTCHALLENGERID";
    // updateUser.targetData = 0;
    //create an updatedUserJSON object to update the User in the Json
    //let updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);

    updateUserCURRENTCHALLENGERID = this._setVal(updateUserCURRENTCHALLENGERID);

    console.log('updateUserCURRENTCHALLENGERID');
    console.log(updateUserCURRENTCHALLENGERID);

    console.log('userIDNumber');
    console.log(userIDNumber);

    lookupOpponentID.lookupField = "NAME";
    lookupOpponentID.lookupKey = selectedOpponent;
    lookupOpponentID.targetField = "CURRENTCHALLENGERID";
    //update the opponent's challengeID to the user's ID
    lookupOpponentID.targetData = userIDNumber;

    //create a new obj with all the updates within it before sending
    let updatedUserJSON = this._setVal(lookupOpponentID);

    //re-set User CURRENTCHALLENGERID field
    //and add result to the updatedUserJSON object
    // updateUserCURRENTCHALLENGERID.lookupField = "NAME";
    // updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
    // updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERID";
    // //update the current user's rank to the selected opponent's rank
    // updateUserCURRENTCHALLENGERID.targetData = 0;

    //add the new changes to the same updatedUserJSON object
   //  updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);
   //  console.log('updatedUserJSON CURRENTCHALLENGERID');
   //  console.log(updatedUserJSON);
   //
   //  //update the Opponent fields
   // updateOpponent.lookupField = "NAME";
   // updateOpponent.lookupKey = selectedOpponent;
   // updateOpponent.targetField = "RANK";
   // //update the opponent's rank to the user's rank
   // updateOpponent.targetData = currentUserRank;
   //
   // console.log('updateOpponent');
   //  console.log(updateOpponent);
   //  //update again with the oppenent's rank also changed
   //  //to the same updatedUserJSON object
   //  updatedUserJSON = this._setVal(updateOpponent);

    //only send after all the updates have been made
    //to the updatedUserJSON object
    this._sendJSONData(updatedUserJSON);

    // reset current user CURRENTCHALLENGERID to 0
  }

//set values in the JSON according to pre-set object that is passed by the calling function
  _setVal(update) {
//console.log('in setval');
console.log(update);
    for (var i = 0; i < update.jsonRS.length; i++) {
      // console.log('in setval for loop');
      // console.log(typeof(update.jsonRS[i][update.lookupField]));
      // console.log(typeof(update.lookupKey));
      //REVIEW: what does update.lookupKey === '*' mean?
        if (update.jsonRS[i][update.lookupField] === update.lookupKey || update.lookupKey === '*') {
          console.log('here1');
            update.jsonRS[i][update.targetField] = update.targetData;
            console.log(update.jsonRS[i][update.targetField]);
            console.log(update.jsonRS);
            return update.jsonRS;
            //if (!update.checkAllRows) { return; }
        }
    }
}

//get values from the JSON according to pre-set object that is passed by the calling function
_getVal(jsonObj){
  for (var i = 0; i < jsonObj.jsonRS.length; i++) {
     console.log('in _getVal for loop');
    console.log(typeof(jsonObj.jsonRS[i][jsonObj.lookupField]));
    console.log(typeof(jsonObj.lookupKey));
    //REVIEW: what does update.lookupKey === '*' mean?
      if (jsonObj.jsonRS[i][jsonObj.lookupField] === jsonObj.lookupKey || jsonObj.lookupKey === '*') {
        console.log('targetField');
        console.log(jsonObj.jsonRS[i][jsonObj.targetField]);
          //jsonObj.jsonRS[i][jsonObj.targetField] = jsonObj.targetData;
          return jsonObj.jsonRS[i][jsonObj.targetField];
          // console.log(update.jsonRS[i][update.targetField]);
          // console.log(update.jsonRS);
          //return jsonObj.jsonRS;
          //if (!update.checkAllRows) { return; }
      }
  }


}

  _sendJSONData(data){

      let req = new XMLHttpRequest();

          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              console.log(req.responseText);
            }
          };

          //NOTE: it is the api.jsonbin NOT the jsonbin.io!
          //JSON data can and should be in ANY order
          //bin id is: https://jsonbin.io/5bd82af2baccb064c0bdc92a/

          req.open("PUT", "https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a", true);
          req.setRequestHeader("Content-type", "application/json");
          var myJsonString = JSON.stringify(data);
          //console.log(myJsonString);
          req.send(myJsonString);
    }


  // _processUpdateCURRENTCHALLENGERID(currentUser, selectedOpponent){
  //
  // console.log('currentUser' + currentUser);
  //
  //              // const currentUserRankInt = parseInt(currentUserRank);
  //              // const selectedOpponentRankInt = parseInt(selectedOpponentRank);
  //
  //               this._updateJSON(currentUser, selectedOpponent, selectedOpponentRank);
  //               return "Thank you. Your result has been entered. Your ranking has been changed"
  //             }
  //
  //             //console.log('here6');
  //     }

  //#region Component events
  /**
   * Handles the 'challenge' button click event which
   * sends a transaction to the contract to store a
   * challenge for the current user.
   *
   * @returns {null}
   */
  _handleClick = async (e) => {

//console.log('in handleclick this._getValidationState()');
    //console.log(this._getValidationState());
      //console.log(this.state.challengeHasChanged);

    // do not post challenge if there is a form error or user has not typed anything
    if(this._getValidationState() === 'error' || !this.state.challengeHasChanged){
      console.log('here preventDefault');
      return e.preventDefault();
    }

    // show loading state
    this.setState({ isLoading: true });


    const challenge = DSportRank.methods.challenge(this.state.challenge);

    try{

      const result = this._updateJSON(this.props.user, this.props.selectedOpponentName);

      // estimate gas before sending challenge transaction
      const gasEstimate = await challenge.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });

      // send the challenge transaction plus a little extra gas in case the contract state
      // has changed since we've done our gas estimate
      await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 1000 });

      // remove loading state
      this.setState({ isLoading: false });

      // tell parent we've updated a user and to re-fetch user details from the contract
      onAfterChallenge();
    }
    catch(err){
      // remove loading state and show error message
      this.setState({ isLoading: false, error: err.message });
    }
  }

   /**
   * When user changes an input value, record that in the state.
   *
   * @param {SyntheticEvent} cross-browser wrapper around the browser’s native event
   *
   * @return {null}
   */
  _handleChange(e) {
    //REVIEW: line below was original but not working
    //changed to working code below for challengeHasChanged
    //let state = {challengeHasChanged: true};
    //state[e.target.name] = e.target.value;
    //this.setState(state);

    this.setState({ challenge: e.target.value });
    this.setState({ challengeHasChanged: true });
  }
  //#endregion

  //#region Helper methods
  /**
   * Validates the form. Return null for no state change,
   * 'success' if valid, and error' if invalid.
   *
   * @return {string} null for no state change, 'success'
   * if valid, and error' if invalid
   */
  _getValidationState() {
    return ((this.state.challenge === '' && !this.state.challengeHasChanged) || (this.state.challenge.length > 0 && this.state.challenge.length <= 140)) ? null : 'error';
  }
  //#endregion

  //#region React lifecycle events
  componentDidMount(){
    // set focus to challenge textarea after render
    if(this.challengeInput) this.challengeInput.focus();
  }

//TODO: get this working from the challenge button not the radio buttons
  // setResult(e) {
  //   this.setState({ selectedChallengeOption: e.target.value });
  //   this.selectedChallengeOption = e.target.value;
  //   //console.log(`state: ${this.selectedOption}, value: ${e.target.value}`);
  //   //REVIEW: to work with this value need to use this.selectedChallengeOption
  //   //and not this.state.selectedChallengeOption
  //     console.log(this.selectedChallengeOption);
  //
  //
  // }

  render(){

    //const userAccountNo = web3.eth.defaultAccount;

    let states = {};
    // state when we are waiting for the App component to finish loading
    // the current account (address) from web3.eth.getAccounts()
    states.isLoading = <Spinner name="pacman" color="white" fadeIn='none' />;

    states.isError = <span className='error'>ERROR!</span>;
//determine userName from account no. stored in JSON
//with this.getUserNameFromAccount(userName)

    const validationState = this._getValidationState();
    const isValid = validationState !== 'error';
    const { isLoading, error, challenge, challengeHasChanged } = this.state;

    let feedback = !isValid ? 'challenge details must be 140 characters or less' : '';
    if(this.state.error) feedback = error;
    let placeholderText = "Please write contact details and suggested court location(s)/time(s)/date(s) you would like to send to ";
    placeholderText += this.props.selectedOpponentName;
    placeholderText += " here:";

    return (
      <>

      <form>
        <FieldGroup
          type="text"
          value={ challenge }
          placeholder= {placeholderText}
          onChange={ (e) => this._handleChange(e) }
          name="Information"
          componentClass="textarea"
          hasFeedback={true}
          validationState={validationState}
          inputRef={(input) => { this.challengeInput = input; }}
        />

        <Button
          bsStyle="primary"
          // disabled={ !isValid || Boolean(error) || !challengeHasChanged }
          // onClick={ (!isValid || Boolean(error) || !challengeHasChanged) ? null : (e) => this._handleClick(e) }
            onClick={ (e) => this._handleClick(e) }
        >{isLoading ? 'Loading...' : 'Post Challenge'}</Button>
        <FormGroup
          controlId="formBasicText"
          validationState={ validationState }
        >
          <HelpBlock>{ feedback }</HelpBlock>
        </FormGroup>
      </form>
      </>
    );
  }
  //#endregion
}
export default DoChallenge
