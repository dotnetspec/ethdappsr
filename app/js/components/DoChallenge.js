import { Link } from 'react-router-dom'
import { Grid, Row, Col, PageHeader, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
//import testData from "../../json/Rankings.json";
import React, { Component } from 'react'
import FieldGroup from './FieldGroup'
import Spinner from 'react-spinkit'
import JSONops from './JSONops'
import {contactNoCB, emailCB} from './Home'
//import sendmail from 'sendmail'

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

  const oppoContactNumber = JSONops._getUserValue(this.props.data, this.props.user, 'CONTACTNO')
  const oppoEmail = JSONops._getUserValue(this.props.data, this.props.user, 'EMAIL')
  const oppoContactNumberTxt = this.props.selectedOpponentName + "'s contact number is : " + oppoContactNumber;
  const oppoEmailTxt = this.props.selectedOpponentName + "'s email address is : " + oppoEmail;

  //contactNoCB callback function (Home.js)
  contactNoCB(oppoContactNumberTxt);
  emailCB(oppoEmailTxt);

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

    // do not post challenge if the opponent already has a challenger
    // if(!JSONops.isPlayerAvailableToChallenge()){
    //     return e.preventDefault();
    // }

    // show loading state
    this.setState({ isLoading: true });

    const { username, account, onAfterChallenge } = this.props;

      console.log('this.state.challenge');
      console.log(this.state.challenge);

    //const challenge = DSportRank.methods.challenge(this.state.challenge);

    //NB: we are not currently sending challenges to the blockchain
    //but updating the json and callback of the contactNoCB
    try{
      //const result = this._updateJSON(this.props.user, this.props.selectedOpponentName);
      JSONops._updateDoChallengeJSON(this.props.user, this.props.selectedOpponentName, this.props.data);

      // estimate gas before sending challenge transaction
      // const gasEstimate = await challenge.estimateGas({ from: web3.eth.defaultAccount });
      //
      // // send the challenge transaction plus a little extra gas in case the contract state
      // // has changed since we've done our gas estimate
      // await challenge.send({ from: web3.eth.defaultAccount, gas: gasEstimate + 1000 });
      //
      // // remove loading state
      // this.setState({ isLoading: false });

      //QUESTION: is this the right place for this function?
      this.displayContactDetails();

      // tell parent we've updated a user and to re-fetch user details from the contract
      //NB: onAfterChallenge undefined error unless use this.props - currently don't know why
      //original code didn't need it
      //this.props.onAfterChallenge();
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
