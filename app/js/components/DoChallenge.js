import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import testData from "../../json/Rankings.json";
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';
import Spinner from 'react-spinkit';

/**
 * Class that renders a form to allow the user to create
 * a challenge that is stored in the contract.
 *
 * @extends React.Component
 */
 //get data from JSON file
     function getData(){
       const data = testData.map(item => {
         // using chancejs to generate guid
         // shortid is probably better but seems to have performance issues
         // on codesandbox.io
         const _id = chance.guid();
         return {
           _id,
           ...item
         };
       });
       return data;
     }


     function getOpponentDetails(){
       var opponentDetails = "Bob 0xD1B15d00dc4E025C1138ec659d8C019dCD8671B80xD1B15d00dc4E025C1138ec659d8C019dCD8671B8";
       return opponentDetails;
     }





class DoChallenge extends Component{

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    //const data = getData();
    //data should have been passed from MyBootstrapTable.js
    const data = this.props.data;
    const { username, account, onAfterchallenge } = this.props;
    // initial state
    this.state = {
      selection: [],
      data,
      showModal: false,
      challenge: '',
      selectedOpponentName: "",
      challengeHasChanged: false,
      isLoading: false,
      error: ''
    };

    this.challengeInput = null;
  }
  //#endregion

  ChallengeOpponent(selectionID){
    var challengedOpponent = this.getUserNameFrom_id(selectionID) + selectionID;
    return challengedOpponent;
  }


  getUserNameFrom_id(_idnumber){

    var playerName = "No name/account match";
    //get data from JSON file
    //map data and retreive corresponding name
    //this.data = this.data.bind(this);

    this.state.data.map((data) =>{
      //if(data._Id === _idnumber){
      if("2bbfa3c9-6ab2-5c35-92bc-5b09056eafe5" === _idnumber){
        console.log(data.NAME);
        playerName = data.NAME;
      }
        else{
        console.log("No name/account match");
        }
   })
    return playerName;
  }

  getUserNameFromAccount() {
    const usernames = [];
    const sample = this.state.data[0];
    //JSON.stringify(sample);
    //console.log(sample);
    Object.keys(sample).forEach(key => {
      if (key !== "_id") {
        usernames.push({
          accessor: key,
          Name: key
        });
      }
    });
    //console.log(usernames);
    return usernames;
  }



  //#region Component events
  /**
   * Handles the 'challenge' button click event which
   * sends a transaction to the contract to store a
   * challenge for the current user.
   *
   * @returns {null}
   */
  _handleClick = async (e) => {

    // do not post challenge if there is a form error or user has not typed anything
    if(this._getValidationState() === 'error' || !this.state.challengeHasChanged){
      return e.preventDefault();
    }

    // show loading state
    this.setState({ isLoading: true });


    const challenge = DSportRank.methods.challenge(this.state.challenge);

    try{
      // estimate gas before sending challenge transaction
      const gasEstimate = await challenge.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });

      // send the challenge transaction plus a little extra gas in case the contract state
      // has changed since we've done our gas estimate
      await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 1000 });

      // remove loading state
      this.setState({ isLoading: false });

      // tell parent we've updated a user and to re-fetch user details from the contract
      onAfterchallenge();
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
    let state = {challengeHasChanged: true};
    state[e.target.name] = e.target.value;
    this.setState(state);
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

  render(){

    const userAccountNo = web3.eth.defaultAccount;
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

    let feedback = !isValid ? 'challenge must be 140 characters or less' : '';
    if(this.state.error) feedback = error;


    return (
      <form>
        <FieldGroup
          type="text"
          value={ challenge }
          placeholder={ this.props.selectedOpponentName }
          onChange={ (e) => this._handleChange(e) }
          name="Information"
          componentClass="textarea"
          hasFeedback={true}
          validationState={validationState}
          inputRef={(input) => { this.challengeInput = input; }}
        />

        <Button
          bsStyle="primary"
          disabled={ !isValid || Boolean(error) || !challengeHasChanged }
          onClick={ (!isValid || Boolean(error) || !challengeHasChanged) ? null : (e) => this._handleClick(e) }
        >{isLoading ? 'Loading...' : 'Post challenge'}</Button>
        <FormGroup
          controlId="formBasicText"
          validationState={ validationState }
        >
          <HelpBlock>{ feedback }</HelpBlock>
        </FormGroup>
      </form>
    );
  }
  //#endregion
}
export default DoChallenge
