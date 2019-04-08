import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
//import testData from "../../json/Rankings.json";
import React, { Component } from 'react'
import FieldGroup from './FieldGroup'
import Spinner from 'react-spinkit'
import JSONops from './JSONops'
import {contactNoCB, emailCB, updatedExtAcctBalCB} from './App'
//import sendmail from 'sendmail'
import Fortmatic from 'fortmatic';

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
    //let onAfterChallenge = this.props.onAfterChallenge();

    // initial state
    this.state = {
      selection: [],
      data: [],
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

//REVIEW: Revive this send mail functionality or remove?
// onClickSendEmail(){
//
//   console.log('here in email');
//
//   const sendmail = require('sendmail')({logger: {
//     debug: console.log,
//     info: console.info,
//     warn: console.warn,
//     error: console.error
//   },
//   silent: false,
//   dkim: { // Default: False
//     // privateKey: fs.readFileSync('./dkim-private.pem', 'utf8'),
//     // keySelector: 'mydomainkey'
//   },
//   devPort: 1025, // Default: False
//   devHost: 'localhost', // Default: localhost
//   smtpPort: 2525, // Default: 25
//   smtpHost: 'localhost' // Default: -1 - extra smtp host after resolveMX);
//   })
//
//       sendmail({
//           from: 'freerossagora@tutanota.com',
//           to: 'test@qq.com, test@sohu.com, test@163.com ',
//           subject: 'test sendmail',
//           html: 'Mail of test sendmail ',
//         }, function(err, reply) {
//           console.log(err && err.stack);
//           console.dir(reply);
//       });
// }

displayContactDetails(){
  const oppoContactNumber = JSONops._getUserValue(this.props.data, this.props.selectedOpponentName, 'CONTACTNO')
  const oppoEmail = JSONops._getUserValue(this.props.data, this.props.selectedOpponentName, 'EMAIL')
  const oppoContactNumberTxt = this.props.selectedOpponentName + "'s contact number is : " + oppoContactNumber;
  const oppoEmailTxt = this.props.selectedOpponentName + "'s email address is : " + oppoEmail;

  //contactNoCB callback function (App.js)
  contactNoCB(oppoContactNumberTxt);
  emailCB(oppoEmailTxt);
  //contactNoCB callback function (Header.js)
  //let tempbalTodisplay = parseInt(this.props.updatedExtAcctBalCB) + (10 ** 18);
  let tempXternAccountno = parseInt(this.props.updatedExtAcctBalCB)
  //tempXternAccountno += 10 ** 18;
  tempXternAccountno += 1;
  updatedExtAcctBalCB(tempXternAccountno)
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
      console.log('in _handleClick');
      //NB: there is now no form to send
    // do not post challenge if there is a form error or user has not typed anything
    // if(this._getValidationState() === 'error' || !this.state.challengeHasChanged){
    //   console.log('here preventDefault');
    //   return e.preventDefault();
    // }

    // show loading state
    this.setState({ isLoading: true });
    //REVIEW: I don't see how these props from orig are used
    //const { username, account, onAfterChallenge } = this.props;
    //this.challengeInput = "at last!";
    //const sendETHDev = DSportRank.methods.sendETHDev();

    //#region the Fortmatic code
    // const fm = new Fortmatic('pk_test_4C66C56C65859E66');
    // window.web3 = new Web3(fm.getProvider());

    // Async functions that triggers login modal, if user not already logged in
    // web3.eth.getAccounts().then((accounts) => {
    //   console.log(accounts); // ['0x...']
    // });
    // web3.eth.getCoinbase().then((coinbase) => {
    //   console.log(coinbase) // '0x...'
    // });
    //#endregion

    // using the callback
    //NB: we are not currently sending challenges to the blockchain
    //but updating the json and callback of the contactNoCB
    //REVIEW: think above comment out of date
    try{
      //https://stackoverflow.com/questions/27176838/reactjs-setstate-is-slow
      //await keyword necessary
      await this.setState(state => {
      state.challenge= this.props.user + " vs " + this.props.selectedOpponentName;
       }, ()=>{
         //after callback
         console.log('this.state.challenge', this.state.challenge)
       });
       const challenge = DSportRank.methods.challenge(this.state.challenge);
       // estimate gas before sending challenge transaction
       const gasEstimate = await web3.eth.estimateGas({ from: web3.eth.defaultAccount });
       //REVIEW; Sending ETH code. Account currently hard coded
       //const resultSentExtBal = await web3.eth.sendTransaction({ from: web3.eth.defaultAccount, to: '0xd496e890fcaa0b8453abb17c061003acb3bcc28e', value: 1**17, gas: gasEstimate + 1000 });
       //0xAC5491BB066c98fec13046928a78761c0B1E5603
       const resultSentExtBal = await web3.eth.sendTransaction({ from: web3.eth.defaultAccount, to: '0xAC5491BB066c98fec13046928a78761c0B1E5603', value: 1**17, gas: gasEstimate + 1000 });


       console.log('web3.eth.defaultAccount', web3.eth.defaultAccount)

       if (resultSentExtBal.status && !Boolean(resultSentExtBal.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
         return this.setState({ isLoading: false, error: 'Error executing transaction, transaction details: ' + JSON.stringify(resultSentExtBal) });
       }
       console.log('gasEstimate', gasEstimate)
       //REVIEW: not currently sure why gasEstimate not working the same as for sendTransaction above
       //currently set with addon 10X higher
       const result = await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 100000 });
       // check result status. if status is false or '0x0', show user the tx details to debug error
      if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
        //console.log(result)
        return this.setState({ isLoading: false, error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
      }
      //REVIEW: Update must come after sendTransaction() in case e.g. there's not enough gas
      //otherwise, if this goes through there could be ranking errors etc.
      JSONops._updateDoChallengeJSON(this.props.newrankIdCB, this.props.user, this.props.selectedOpponentName, this.props.data);
      // remove loading state
      this.setState({ isLoading: false });
      // tell parent we've updated a user and to re-fetch user details from the contract
      this.props.onAfterChallenge();
      //QUESTION: is this the right place for this function?
      this.displayContactDetails();
    }
    catch(err){
      //console.log(result)
      console.log(err)
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
        {/* REVIEW: Re-enable this challenge functionality? */}
      {/*
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
        */}
        {/* REVIEW: Re-enable this validation functionality? */}

        <Button
          bsStyle="primary"
          // disabled={ !isValid || Boolean(error) || !challengeHasChanged }
          // onClick={ (!isValid || Boolean(error) || !challengeHasChanged) ? null : (e) => this._handleClick(e) }
            onClick={ (e) => this._handleClick(e) }
            //onClick={ () => this.onClickSendEmail() }
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
