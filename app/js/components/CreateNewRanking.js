import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, PageHeader, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import FieldGroup from './FieldGroup'
import JSONops from './JSONops'


//helper class
class UserConfirmCreateNewRanking extends Component {

   render(

   ) {
     const isLoading = false;
              return (
                <div>
                hello
                <Button
                  //bsStyle="primary"
                  //disabled={ !isValid }
                  //onClick={ !isValid ? null : (e) => this._continueClick(e) }
                  onClick={ (e) => this._cancelClick(e) }
                >
                { isLoading ? 'Loading...' : 'Cancel' }
                </Button>
               </div>);
          }
        }

/**
 * Class that renders a form to facilitate the creation
 * of a user in the contract.
 *
 * @extends React.Component
 */
class CreateNewRanking extends Component {

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      isLoading: false,
      username: '',
      contactno: '',
      email: '',
      description: '',
      usernameHasChanged: false,
      error: '',
      WarningModalIsOpen: false,
      warningText: '',
      userConfirm: false
    };
  }

_continueClick = () => {
  //_continueClick(){
      this.setState({ userConfirm: true });
      //console.log('userConfirm in _continueClick1')
      //console.log(this.state.userConfirm)
      this.setState({ WarningModalIsOpen: false });
      //console.log('userConfirm in _continueClick2')
    //  console.log(this.state.userConfirm)
      this._handleClick();
      //console.log('_continueClick');
  }
  //#endregion

  //#region Component events
  /**
   * Handles the 'Create Account' button click event which
   * sends a transaction to the contract to create a user.
   *
   * @returns {null}
   */
  _handleClick = async () => {

    //console.log(JSONops.createNewUserInJSON());
    //TODO: all the json data for create new user is here ready to be appended to
    //console.log(this.props.rankingJSONdata);
    this.setState({ isLoading: true });

      console.log('this.state.userConfirm')
      console.log(this.state.userConfirm)

    if (this.state.userConfirm === false){
      this.setState({ WarningModalIsOpen: true });
    }
    //only do this once the user has confirmed the user name because it cannot be
    //changed in future
    if(this.state.userConfirm){
              JSONops.createNewUserInJSON(this.props.rankingJSONdata, this.state.username, this.state.contactno, this.state.email, this.props.account, this.state.description);
              const { username, description } = this.state;
              try {
                // set up our contract method with the input values from the form
                const createAccount = DSportRank.methods.createAccount(username, description);
                // get a gas estimate before sending the transaction
                const gasEstimate = await createAccount.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });
                // send the transaction to create an account with our gas estimate
                // (plus a little bit more in case the contract state has changed).
                const result = await createAccount.send({ from: web3.eth.defaultAccount,  gas: gasEstimate + 1000 });
                // check result status. if status is false or '0x0', show user the tx details to debug error
                if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
                  return this.setState({ isLoading: false, error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
                }
                // Completed of async action, set loading state back
                this.setState({ isLoading: false });
                // tell our parent (app.js) that we've created a user so it
                // will re-fetch the current user details from the contract (re-load the account info)
                this.props.onAfterUserUpdate();
                // redirect user to the  update user page
                //this.props.history.push('/update/@' + username);
                this.props.history.push('/');
              } catch (err) {
                // stop loading state and show the error
                this.setState({ isLoading: false, error: err.message });
              };
            //user didn't confirm
          }else{
              console.log('user has not confirmed')
            // const wtext = 'Please ensure your username is as you want it'
            // wtext = ' since it CANNOT be changed, even if you de-activate your account!'
            //   this.setState({ warningText: wtext });
          }
  }

  getUserConfirmationOfAccountCreation(){
    //REVIEW: Fix the validation isLoading if necessary
     const isLoading = false;
     let  wtext = 'Please ensure your username (' + this.state.username + ') is exactly as you want it'
            wtext += ' since it CANNOT be changed, even if you de-activate your account!'
    return (
      <div>
      {wtext}<p></p>
      <Button
        bsstyle="primary"
        //validation is done by the 'create user' button
        //not here
        // disabled={ !isValid }
        // onClick={ !isValid ? null : (e) => this._handleClick(e) }
        onClick={ (e) => this._cancelClick(e) }
      >
      { isLoading ? 'Loading...' : 'Cancel' }
      </Button><p></p>
      Go ahead I am happy with this username: <p></p>
      <Button
        bsstyle="primary"
        //validation is done by the 'create user' button
        //not here
        // disabled={ !isValid }
        // onClick={ !isValid ? null : (e) => this._continueClick(e) }
        onClick={ (e) => this._continueClick(e) }
      >
      { isLoading ? 'Loading...' : 'Continue' }
      </Button>
     </div>);
  }

  /**
   * When user changes an input value, record that in the state.
   * Additionally, if the username field was updated, perform a
   * check to see if the username already exists in the contract
   * and set the component state accordingly
   *
   * @param {SyntheticEvent} cross-browser wrapper around the browser’s native event
   *
   * @return {null}
   */
  _handleChange = async(e) => {
    let state = {};
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;
    if (input === 'username') {
      state.usernameHasChanged = true;
      if (value.length >= 5) {
        // ensure we're not already loading the last lookup
        if (!this.state.isLoading) {
          // call the userExists method in our contract asynchronously
          DSportRank.methods.userExists(web3.utils.keccak256(value)).call()
          .then((exists) => {
            // stop loading state
            state.isLoading = false;
            // show error to user if user doesn't exist
            state.error = exists ? 'Username not available' : '';
            this.setState(state);
          }).catch((err) => {
            // stop loading state
            state.isLoading = false;
            // show error message to user
            state.error = err.message;
            this.setState(state);
          });
          // set loading state while checking the contract
          state.isLoading = true;
        }
        // we are loading already, do nothing while we wait
        return true;
      }
    }
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

    // considered valid while loading as we don't know yet
    if (this.state.isLoading) return null;

    // check that we have at least 5 characters in the username
    const length = this.state.username.length;
    if (length === 0){
      if(this.state.usernameHasChanged) return 'error';
      return null;
    }
    if (length <= 5) return 'error';

    // don't allow '@' or spaces
    if(new RegExp(/[@\s]/gi).test(this.state.username)) return 'error';

    // if we have an error, returning 'error' shows the user
    // the form is in error (red). Conversely, returning 'success'
    // shows the user the form is valid (green).
    return this.state.error.length > 0 ? 'error' : 'success';
  }

  _cancelClick(e) {
    try {
    //this.props.history.push('/');
    //console.log('user cancelled')
    this.setState({ userConfirm: false });
    this.setState({ WarningModalIsOpen: false });
    } catch (err) {
    // stop loading state and show the error
    console.log(err.message);
    };
  }

  closeWarningModal = () => {
    this.setState({ WarningModalIsOpen: false });
  };
  //#endregion

  //#region React lifecycle events
  render() {
    const { isLoading } = this.state;
    let validationState = this._getValidationState();
    let isValid = validationState === 'success' && !isLoading && !this.state.error;
    let feedback = isValid ? 'Username is available' : this.state.error || 'Usernames must be 6 or more characters and cannot include @ or spaces.';

    if (!this.state.usernameHasChanged) feedback = '';

    return (
      <Grid>
      <Modal
          show={this.state.WarningModalIsOpen}
        >
        <Modal.Header closeButton>
          <Modal.Title>Please Note!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {this.getUserConfirmationOfAccountCreation()}

        </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeWarningModal}>Close</Button>

          </Modal.Footer>
        </Modal>
        <Row>
          <Col xs={12}>
          <PageHeader>Create An Account Name<small> for account number:  { this.props.account }</small></PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <form onSubmit={ !isValid ? null : (e) => this._continueClick(e) }>
              <FieldGroup
                type="text"
                value={ this.state.username }
                disabled={ isLoading }
                placeholder="No gaps e.g. My_SRAccount1 - Must be unique. Cannot be changed!"
                onKeyPress={ (e) => e.key === '@' || e.key === ' ' ? e.preventDefault() : true }
                onChange={ (e) => this._handleChange(e) }
                name="username"
                autoComplete="off"
                label="Desired Account Name (Cannot Be Changed!)"
                validationState={ validationState }
                hasFeedback={ true }
                help={ feedback }
                inputAddOn={
                  {
                    location: 'before',
                    addOn: '@'
                  }
                }
              />
              <FieldGroup
                type="text"
                value={ this.state.contactno }
                placeholder="Contact Number"
                onChange={(e) => this._handleChange(e)}
                name="contactno"
                label="Your Contact Number"
              />
              <FieldGroup
                type="text"
                value={ this.state.email }
                placeholder="Contact Email"
                onChange={(e) => this._handleChange(e)}
                name="email"
                label="Your Contact Email"
              />
              <FieldGroup
                type="text"
                value={ this.state.description }
                placeholder="Additional info e.g. "
                onChange={(e) => this._handleChange(e)}
                name="description"
                label="Player Description"
              />
              <Button
                bsstyle="primary"
                disabled={ !isValid }
                onClick={ !isValid ? null : (e) => this._continueClick(e) }
                //onClick={ (e) => this._continueClick(e) }
              >
                { isLoading ? 'Loading...' : 'Create New Ranking' }
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
  //#endregion
}

//NB: this component copied from CreateUser.
//withRouter removed
//export default withRouter(CreateNewRanking);
export default CreateNewRanking;
