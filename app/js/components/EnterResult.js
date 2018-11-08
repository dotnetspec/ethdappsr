import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, Radio, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
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

class EnterResult extends Component{

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    const data = this.props.data;
    //REVIEW: How is this line below supposed to work?
    const { username, account, onAfterChallenge } = this.props;

    //REVIEW: to see the selectedOption change in console had to use an auxilary variabe
    //https://stackoverflow.com/questions/34974775/react-js-setstate-is-late-on-last-input
    //much of this code is redundant pertaining to the original app DoTweet functionality only
    this.selectedOption = "";
    // initial state
    this.state = {
      input: '',
      selection: [],
      //data,
      showModal: false,
      challenge: '',
      resultHasChanged: false,
      isLoading: false,
      error: '',
      selectedOption: 'undecided'
    };

    this.challengeInput = null;
  }
  //#endregion



_processResult(wonorLost, selectedOpponent, currentUser, currentUserRank, selectedOpponentRank){

console.log('currentUser' + currentUser);

             const currentUserRankInt = parseInt(currentUserRank);
             const selectedOpponentRankInt = parseInt(selectedOpponentRank);

            if (wonorLost === 'won' && currentUserRankInt < selectedOpponentRankInt){
            //No change. Do nothing
            console.log('won do nothing');
              return "Thank you. Your result has been entered. Your ranking is unchanged"

            }else if (wonorLost === 'lost' && currentUserRankInt > selectedOpponentRankInt){
            console.log('lost do nothing');
              return "Thank you. Your result has been entered. Your ranking is unchanged"

            }else{
              console.log('update');
              this._updateJSON(currentUser, currentUserRank, selectedOpponent, selectedOpponentRank);
              return "Thank you. Your result has been entered. Your ranking has been changed"
            }

            //console.log('here6');
    }

//TODO: Refactor _updateJSON
    _updateJSON(currentUser, currentUserRank, selectedOpponent, selectedOpponentRank){

      //REVIEW: using currentUser as lookupKey. May link to id in future

      console.log(currentUser);

      //use update objects to manage the json data
      //values are just placeholders until they get updated
      let updateUserRank = {
        jsonRS: this.props.data,
        lookupField: "",
        lookupKey: 0,
        targetField: "",
        targetData: "",
        checkAllRows: false
        };

        let updateUserCURRENTCHALLENGERID = {
          jsonRS: this.props.data,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

        let updateOpponent = {
          jsonRS: this.props.data,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

        console.log(selectedOpponentRank);
      console.log(typeof selectedOpponentRank);

      //update the User RANK field
      updateUserRank.lookupField = "NAME";
      updateUserRank.lookupKey = currentUser;
      updateUserRank.targetField = "RANK";
      //update the current user's rank to the selected opponent's rank
      updateUserRank.targetData = selectedOpponentRank;
      //re-set user's CURRENTCHALLENGERID to 0
      // updateUser.targetField = "CURRENTCHALLENGERID";
      // updateUser.targetData = 0;

      //create an updatedUserJSON object to update the User in the Json
      //_setVal each time you need to make a change
      let updatedUserJSON = this._setVal(updateUserRank);
      console.log('updatedUserJSON');
      console.log(updatedUserJSON);

      //re-set User CURRENTCHALLENGERID field
      //and add result to the updatedUserJSON object
      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERID";
      //update the current user's rank to the selected opponent's rank
      updateUserCURRENTCHALLENGERID.targetData = 0;

      //add the new changes to the same updatedUserJSON object
      updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);
      console.log('updatedUserJSON CURRENTCHALLENGERID');
      console.log(updatedUserJSON);

      //re-set the current user's CURRENTCHALLENGERNAME
      //TODO:change updateUserCURRENTCHALLENGERID to a better name
      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERNAME";
      //update the current user's rank to the selected opponent's rank
      updateUserCURRENTCHALLENGERID.targetData = "Available";
      updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);

      //update the Opponent fields
     updateOpponent.lookupField = "NAME";
     updateOpponent.lookupKey = selectedOpponent;
     updateOpponent.targetField = "RANK";
     //update the opponent's rank to the user's rank
     updateOpponent.targetData = currentUserRank;

       updatedUserJSON = this._setVal(updateOpponent);

     console.log('updateOpponent');
      console.log(updateOpponent);
      //update again with the oppenent's CURRENTCHALLENGERNAME also changed
      //to the same updatedUserJSON object

      updateOpponent.lookupField = "NAME";
      updateOpponent.lookupKey = selectedOpponent;
      updateOpponent.targetField = "CURRENTCHALLENGERNAME";
      //update the opponent's rank to the user's rank
      updateOpponent.targetData = "Available";

      updatedUserJSON = this._setVal(updateOpponent);


      //only send after all the updates have been made
      //to the updatedUserJSON object
      this._sendJSONData(updatedUserJSON);

      // reset current user CURRENTCHALLENGERID to 0
    }

    _setVal(update) {
  //console.log('in setval');
  console.log(update);
      for (var i = 0; i < update.jsonRS.length; i++) {
        // console.log('in setval for loop');
        // console.log(typeof(update.jsonRS[i][update.lookupField]));
        // console.log(typeof(update.lookupKey));
        //REVIEW: what does update.lookupKey === '*' mean?
          if (update.jsonRS[i][update.lookupField] === update.lookupKey || update.lookupKey === '*') {
            //console.log('here1');
              update.jsonRS[i][update.targetField] = update.targetData;
              // console.log(update.jsonRS[i][update.targetField]);
              // console.log(update.jsonRS);
              return update.jsonRS;
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


  //#region Component events
  /**
   * Handles the 'challenge' button click event which
   * sends a transaction to the contract to store a
   * challenge for the current user.
   *
   * @returns {null}
   */

   //REVIEW: _handleClick can probably be removed from this component
  _handleClick = async (e) => {

    // do not post challenge if there is a form error or user has not typed anything
    // if(this._getValidationState() === 'error' || !this.state.resultHasChanged){
    //   return e.preventDefault();
    // }

    // show loading state
    //this.setState({ isLoading: true });


    //const challenge = DSportRank.methods.challenge(this.state.challenge);

    try{

      const result = this._processResult(this.selectedOption, this.props.selectedOpponentName,
        this.props.user, this.props.currentUserRank, this.props.selectedOpponentRank);

        console.log('_handleClick');
        console.log(result);

      // estimate gas before sending challenge transaction
      //const gasEstimate = await challenge.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });

      // send the challenge transaction plus a little extra gas in case the contract state
      // has changed since we've done our gas estimate
      //await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 1000 });

      // remove loading state
      //this.setState({ isLoading: false });

      // tell parent we've updated a user and to re-fetch user details from the contract
      this.props.onAfterChallenge();
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
    //return ((this.state.challenge === '' && !this.state.resultHasChanged) || (this.state.challenge.length > 0 && this.state.challenge.length <= 140)) ? null : 'error';
  }
  //#endregion

  //#region React lifecycle events
  componentDidMount(){
    // set focus to challenge textarea after render
    //if(this.challengeInput) this.challengeInput.focus();
  }


  setResult(e) {
    this.setState({ selectedOption: e.target.value });
    this.selectedOption = e.target.value;
    //console.log(`state: ${this.selectedOption}, value: ${e.target.value}`);
    //REVIEW: to work with this value need to use this.selectedOption
    //and not this.state.selectedOption
      console.log('Result is ...' + this.selectedOption);
      //this.setState({ showModal: false });
  }



  render(){
    //REVIEW: remove comments?
    //state is handled by DoChallenge now
    return (
<>
      <div onChange={event => this.setResult(event)}>
              <input type="radio" value="won" name="result"/> Won
              <input type="radio" value="lost" name="result"/> Lost
              <input type="radio" value="undecided" name="result"/> Undecided
      </div>
      <form>
        <Button
          bsStyle="primary"
          //disabled={ !isValid || Boolean(error) || !resultHasChanged }
          //onClick={ (!isValid || Boolean(error) || !resultHasChanged) ? null : (e) => this._handleClick(e) }
          onClick={ (e) => this._handleClick(e) }
        >Post Result</Button>
        <FormGroup
          controlId="formBasicText"
          //validationState={ validationState }
        >
          <HelpBlock></HelpBlock>
        </FormGroup>
      </form>
</>
    );
  }
  //#endregion
}
export default EnterResult
