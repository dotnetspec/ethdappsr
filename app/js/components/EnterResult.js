import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, Radio, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
//import testData from "../../json/Rankings.json";
import React, { Component } from 'react'
import FieldGroup from './FieldGroup'
import Spinner from 'react-spinkit'
import JSONops from './JSONops'

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



_processResult(resultEntered, playerNameOnRowClicked, currentUser, currentUserRank, selectedOpponentRank){

console.log('resultEntered ' + resultEntered);

//REVIEW: ensure handle the opponent's row being clicked as well as user's row
let checkedUserRank, checkedOpponentRank = 0;

const opponentCurrentlyChallengingUser = JSONops._getUserValue(this.props.data, currentUser, "CURRENTCHALLENGERNAME");

if(currentUser === playerNameOnRowClicked){
  //get the RANK value from the opponent
  //console.log('1')
  checkedUserRank = currentUserRank;
  checkedOpponentRank = selectedOpponentRank;
}
else{
  //console.log('2')
  checkedUserRank = JSONops._getUserValue(this.props.data, currentUser, "RANK");
  checkedOpponentRank = JSONops._getUserValue(this.props.data, opponentCurrentlyChallengingUser, "RANK");
}

             const currentUserRankInt = parseInt(checkedUserRank);
             const selectedOpponentRankInt = parseInt(checkedOpponentRank);

             console.log('currentUserRankInt')
             console.log(currentUserRankInt)
             console.log('selectedOpponentRankInt')
             console.log(selectedOpponentRankInt)


             if (resultEntered === 'undecided' ){
               JSONops._updateEnterResultUnchangedJSON(currentUser,playerNameOnRowClicked, this.props.data);
               return "Thank you. No changes have been made. Your ranking is unchanged"
             }
             else if (resultEntered === 'won' && currentUserRankInt < selectedOpponentRankInt){
              JSONops._updateEnterResultUnchangedJSON(currentUser,playerNameOnRowClicked, this.props.data);
              return "Thank you. Your result has been entered. Your ranking is unchanged"

            }else if (resultEntered === 'lost' && currentUserRankInt > selectedOpponentRankInt){
              JSONops._updateEnterResultUnchangedJSON(currentUser,playerNameOnRowClicked, this.props.data);
              return "Thank you. Your result has been entered. Your ranking is unchanged"

            }else{

              //this._updateJSON(currentUser, currentUserRank, playerNameOnRowClicked, selectedOpponentRank);
              JSONops._updateEnterResultJSON(currentUser, checkedUserRank, playerNameOnRowClicked, checkedOpponentRank, this.props.data);
              console.log('result send to _updateEnterResultJSON');
              return "Thank you. Your result has been entered. Your ranking has been changed"
            }

            //console.log('here6');
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
              <input type="radio" value="won" name="result"/> Won<p></p>
              <input type="radio" value="lost" name="result"/> Lost<p></p>
              <input type="radio" value="undecided" name="result"/> Undecided
      </div>
      <p></p>
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
