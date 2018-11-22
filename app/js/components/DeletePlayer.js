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
class DeletePlayer extends Component {

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
  _handleClick = async () => {

    //console.log(JSONops.createNewUserInJSON());
    //TODO: all the json data for create new user is here ready to be appended to
    //console.log(this.props.rankingJSONdata);
    //JSONops.createNewUserInJSON(this.props.rankingJSONdata, this.state.username, this.props.account, this.state.description);
    try {
    //const deletedPlayerJSON = JSONops.deletePlayer(this.props.rankingJSONdata, this.props.user, this.props.account);
    //const deactivatedPlayerJSON = JSONops.deactivatePlayer(this.props.rankingJSONdata, this.props.user, this.props.account);
    JSONops.deactivatePlayer(this.props.rankingJSONdata, this.props.user, this.props.account);

    //QUESTION: how to navigate?
    //this.props.history.push('/');
    //console.log(deactivatedPlayerJSON);

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
(You can re-activate in future via the 'Update Profile')
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
        </Grid>
      </>
    );
  }
  //#endregion
}

export default withRouter(DeletePlayer);
