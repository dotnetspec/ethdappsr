import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Image, Grid, Col, Row, PageHeader } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';
import JSONops from './JSONops'

class UpdateUser extends Component {

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      isLoading: false,
      picture: '',
      description: this.props.user.description,
      error: '',
      formState: null,
      formUpdated: false
    };
  }
  //#endregion

  //#region Component events
  /**
   * Handles the 'Update user' button click event which
   * sends a transaction to the contract to update the
   * user's profile.
   *
   * @returns {null}
   */
  _handleClick = async () => {

    const { account, user } = this.props;
    const { description } = this.state;
    //REVIEW: Had to change below to cover no player in json but account active
    // if the form has not been updated, do nothing
    //if (!this.state.formUpdated) return;

    // show loading state
    this.setState({ isLoading: true });

//if the ployer account name isn't yet listed as a 'NAME' in the json (should be just a dev issue)
//caused by deleting accounts for dev purposes
if (!JSONops.isPlayerListedInJSON(this.props.rankingJSONdata, user.username)){
    JSONops.createNewUserInJSON(this.props.rankingJSONdata, user.username, this.props.account, this.state.description);
    this.props.history.push('/');
}

    // if the user has updated their photo, try to upload it to ipfs
    // and use the resulting ipfs hash to send to the contract as part
    // of the user's profile.
    let hash = '';
    if (this.state.picture !== '') {
      try {
        // upload the file to ipfs and get the resulting hash
          user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;
        hash = '';
      }
      catch (err) {
        // stop loading state and show user the error
        return this.setState({ isLoading: false, formState: 'error', error: err.message });
      }
      this.props.history.push('/');
    }


    // get a handle for the editAccount method

    // get a gas estimate for the transaction with the input username
    // and description

    try {
      // send the transaction with our gas estimate (plus a little bit more in case the contract)
      // state has changed since we got our estimate

      const usernameHash = web3.utils.keccak256(user.username);
      const updatedDescription = this.state.description;
      const updatedImageHash = 'QmWvPtv2xVGgdV12cezG7iCQ4hQ52e4ptmFFnBK3gTjnec';

      // set up our contract method with the input values from the form
          const editAccount = DSportRank.methods.editAccount(usernameHash, updatedDescription, updatedImageHash);

          // get a gas estimate before sending the transaction
          const gasEstimate = await editAccount.estimateGas({ from: web3.eth.defaultAccount, gas: 10000000000 });


            const result = await editAccount.send({ from: web3.eth.defaultAccount,  gas: gasEstimate + 1000 });

      if (result.status && !Boolean(result.status.toString().replace('0x', ''))) {
        return this.setState({ isLoading: false, formState: 'error', formUpdated: false, error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
      }

      // stop loading state, and render the form as successful
      this.setState({ isLoading: false, formState: 'success', formUpdated: false });

      // tell parent we've updated our user, so the current
      // user is re-fetched to get the user's details
      return this.props.onAfterUserUpdate();
    }
    catch (err) {
      // stop loading state and show user the error
      this.setState({ isLoading: false, formState: 'error', formUpdated: false, error: err.message });
    }

    return null;
  }

  /**
   * When user changes an input value, record that in the state.
   * Additionally, sets state that the form has been updated to
   * allow for more fine validation control
   *
   * @param {SyntheticEvent} cross-browser wrapper around the browser’s native event
   *
   * @return {null}
   */
  _handleChange(e) {
    let state = { formUpdated: true };
    const input = e.target.name;
    const value = e.target.value;

    state[input] = value;

    this.setState(state);
  }

//QUESTION; Why was it necessary to send this.props.user[1] as a parameter
//to this function and not just use this.props.user (which is seen as an object by JSONops.reactivatePlayer)?
  _handleReactivatePlayer(user) {
    try {
    JSONops.reactivatePlayer(this.props.rankingJSONdata, user, this.props.account);
      this.props.history.push('/');
    } catch (err) {
    // stop loading state and show the error
    console.log(err.message);
    };
  }

  _cancelClick(e) {
    try {
    this.props.history.push('/');
    } catch (err) {
    // stop loading state and show the error
    console.log(err.message);
    };
  }

  //#endergion

  //#region React lifecycle events
  componentDidUpdate(prevProps){
    if(this.props.user.description !== prevProps.user.description){
      this.setState({description: this.props.user.description});
    }
  }

  render() {
    const { isLoading, error, formState, formUpdated, description, picture } = this.state;
    const { user } = this.props;
    const feedback = formState === 'success' ? 'Saved' : error;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>Update { user.username } <small>{this.props.account}</small></PageHeader>
          </Col>
        </Row>
        <p></p>
        <Row className="show-grid">
          <Col xs={12} >
            <Button
              bsStyle="primary"
              //disabled={ !isValid }
              //onClick={ !isValid ? null : (e) => this._handleClick(e) }
              onClick={ (e) => this._cancelClick(e) }
            >
            { isLoading ? 'Loading...' : 'Cancel' }
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <form onSubmit={ isLoading || !formUpdated ? null : (e) => this._handleClick(e) }>
              <FieldGroup
                type="text"
                value={ user.username }
                disabled={true}
                name="username"
                label="Player Name"
              />
              <FieldGroup
                type="text"
                value={ description }
                placeholder="Grade, Contact Details etc."
                onChange={ (e) => this._handleChange(e) }
                name="description"
                label="Player Details"
                validationState={ formState }
              />
              <FieldGroup
                type="file"
                value={ picture }
                onChange={ (e) => this._handleChange(e) }
                name="picture"
                label="Profile picture"
                inputRef={ (input) => this.inputPicture = input }
                validationState={ formState }
              />
              <FormGroup>
                { user.picture.length ? <Image src={ user.picture } width="100" circle /> : '' }
              </FormGroup>
              <FormGroup>
                <Button
                  bsStyle="primary"
                  // disabled={ isLoading || !formUpdated }
                  // onClick={ isLoading || !formUpdated ? null : (e) => this._handleClick(e) }
                  onClick={ (e) => this._handleClick(e, user.username) }
                >
                  { isLoading ? 'Loading...' : 'Update profile' }
                </Button>
              </FormGroup>
              <FormGroup
                validationState={ formState }
              >
                <HelpBlock>{ feedback }</HelpBlock>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
  //#endregion
}

export default withRouter(UpdateUser);
