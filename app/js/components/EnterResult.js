import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, Radio, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
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

class EnterResult extends Component{

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    const data = this.props.data;
    const { username, account, onAfterchallenge } = this.props;


    //REVIEW: to see the selectedOption change in console had to use an auxilary variabe
    //https://stackoverflow.com/questions/34974775/react-js-setstate-is-late-on-last-input
    //much of this code is redundant pertaining to the original app DoTweet functionality only
    this.selectedOption = "";
    // initial state
    this.state = {
      input: '',
      selection: [],
      data,
      showModal: false,
      challenge: '',
      selectedOpponentName: "",
      resultHasChanged: false,
      isLoading: false,
      error: '',
      selectedOption: 'undecided'
    };

    this.challengeInput = null;
  }
  //#endregion

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
    if(this._getValidationState() === 'error' || !this.state.resultHasChanged){
      return e.preventDefault();
    }

    // show loading state
    this.setState({ isLoading: true });


    //const challenge = DSportRank.methods.challenge(this.state.challenge);

    try{
      console.log('clicked');
      // estimate gas before sending challenge transaction
      //const gasEstimate = await challenge.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });

      // send the challenge transaction plus a little extra gas in case the contract state
      // has changed since we've done our gas estimate
      //await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 1000 });

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
    return ((this.state.challenge === '' && !this.state.resultHasChanged) || (this.state.challenge.length > 0 && this.state.challenge.length <= 140)) ? null : 'error';
  }
  //#endregion

  //#region React lifecycle events
  componentDidMount(){
    // set focus to challenge textarea after render
    if(this.challengeInput) this.challengeInput.focus();
  }


  setResult(e) {
    this.setState({ selectedOption: e.target.value });
    this.selectedOption = e.target.value;
    //console.log(`state: ${this.selectedOption}, value: ${e.target.value}`);
    //REVIEW: to work with this value need to use this.selectedOption
    //and not this.state.selectedOption
      console.log(this.selectedOption);
  }



  render(){
    let states = {};
    // state when we are waiting for the App component to finish loading
    // the current account (address) from web3.eth.getAccounts()
    states.isLoading = <Spinner name="pacman" color="white" fadeIn='none' />;

    states.isError = <span className='error'>ERROR!</span>;
//determine userName from account no. stored in JSON
//with this.getUserNameFromAccount(userName)

    const validationState = this._getValidationState();
    const isValid = validationState !== 'error';
    const { isLoading, error, challenge, resultHasChanged } = this.state;

    let feedback = !isValid ? 'challenge must be 140 characters or less' : '';
    if(this.state.error) feedback = error;


    return (
<>
      <div onChange={event => this.setResult(event)}>
              <input type="radio" value="won" name="gender"/> Won
              <input type="radio" value="lost" name="gender"/> Lost
              <input type="radio" value="undecided" name="gender"/> Undecided
      </div>
      <form>
        <Button
          bsStyle="primary"
          disabled={ !isValid || Boolean(error) || !resultHasChanged }
          onClick={ (!isValid || Boolean(error) || !resultHasChanged) ? null : (e) => this._handleClick(e) }
        >{isLoading ? 'Loading...' : 'Post Result'}</Button>
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
export default EnterResult
