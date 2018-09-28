import { Link } from 'react-router-dom'
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';

/**
 * Class that renders a form to allow the user to create
 * a challenge that is stored in the contract.
 *
 * @extends React.Component
 */
class Dochallenge extends Component{

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      challenge: '',
      challengeHasChanged: false,
      isLoading: false,
      error: ''
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
  _handleClick = async (e) => {

    // do not post challenge if there is a form error or user has not typed anything
    if(this._getValidationState() === 'error' || !this.state.challengeHasChanged){
      return e.preventDefault();
    }

    // show loading state
    this.setState({ isLoading: true });

    const { username, account, onAfterchallenge } = this.props;
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
          placeholder="140 characters or less..."
          onChange={ (e) => this._handleChange(e) }
          name="Instructions"
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
export default Dochallenge