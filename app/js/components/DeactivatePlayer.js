import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, PageHeader } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import FieldGroup from './FieldGroup'
import JSONops from './JSONops'

/**
 * REVIEW: Class that renders a form to facilitate the deletion
 * of a user (or player?) in the contract (or just json?).
 *
 * @extends React.Component
 */
class DeactivatePlayer extends Component {

  //#region Constructor
  constructor(props, context) {
    super(props, context);

    // initial state
    this.state = {
      isLoading: false,
      username: '',
      description: '',
      usernameHasChanged: false,
      error: ''
    };
  }
  //#endregion

  //#region Component events
  /**
   * Handles the 'Create Account' button click event which
   * sends a transaction to the contract to create a user.
   *
   * @returns {null}
   */

   //QUESTION: why does below not work with this.props.history.push('/');?
  //_handleClick = async () => {
  _handleClick(e) {
    try {
      console.log('this.props.newrankIdCB',this.props.newrankIdCB)
    JSONops.deactivatePlayer(this.props.newrankIdCB, this.props.rankingJSONdata, this.props.user, this.props.account);
    this.props.history.push('/home/@' + this.props.user);
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

  //#endregion

  //#region React lifecycle events
  render() {
    const { isLoading } = this.state;
    // let validationState = this._getValidationState();
    // let isValid = validationState === 'success' && !isLoading && !this.state.error;
    // let feedback = isValid ? 'Username is available' : this.state.error || 'Usernames must be 6 or more characters and cannot include @ or spaces.';
    //
    // if (!this.state.usernameHasChanged) feedback = '';
    return (
      <>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8}>
              <h3 align='center'>Are you sure you want to deactive this player?</h3>
              <h5 align='center'>(You can re-activate (at the bottom of the rankings) in future via 'Update Profile')</h5>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={8} xsOffset={3} >

              <Button
                bsStyle="primary"
                //disabled={ !isValid }
                //onClick={ !isValid ? null : (e) => this._handleClick(e) }
                onClick={ (e) => this._handleClick(e) }
              >
              { isLoading ? 'Loading...' : 'De-Activate Player' }
              </Button>
            </Col>
          </Row>
          <p></p>
          <Row className="show-grid">
            <Col xs={12} md={8} xsOffset={3} >
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
        </Grid>
      </>
    );
  }
  //#endregion
}

export default withRouter(DeactivatePlayer);
