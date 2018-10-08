import { Grid, Row, Col, Thumbnail, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';
import { formatDistance } from 'date-fns/esm'
import { EventEmitter } from 'events';

// The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.
class Userchallenges extends Component {

  //#region Constructor
  constructor(props, context){
    super(props, context);
    this.state = {
      user: {},
      challenges: []
    };
    this.event = null;
  }
  //#endregion

  //#region Helper methods
  /**
   * Get the user details and subscribe to their challenge event
   */
  _init(){
    const { username } = this.props.match.params;
    this._getUserDetails(username);

    // subscribe to challenge events
    this._subscribeToNewchallengeEvent(username);
  }

  /**
   * Fetches the user's details from the contract for display
   */
  _getUserDetails = async(username) => {
      // get user details and update state
      //let user = { creationDate: '' } // remove me
      let user = await DSportRank.methods.users(web3.utils.keccak256(username)).call();

      // update picture url for ipfs
      user.picture = user.picture.length > 0 ? EmbarkJS.Storage.getUrl(user.picture) : imgAvatar;

      // format the user.creationDate for display
      user.creationDate = this._formatDate(user.creationDate);

      this.setState({user: user});
  }

  /**
   * Subscribes to a challenge event from the contract.
   * When a challenge is received, it is appended to the list of
   * challenges.
   *
   * @param {String} username
   * @returns {null}
   */
  _subscribeToNewchallengeEvent(username){
    // this.event = new EventEmitter() // replace me with the Newchallenge subscription
    //   .on('data', (event) => {
    //     let challenges = this.state.challenges;
    //
    //     challenges.push({
    //       content: event.returnValues.challenge,
    //       time: this._formatDate(event.returnValues.time)
    //     });
    //
    //     this.setState({challenges: challenges});
    //   })
    //   .on('error', function(error){
    //     this.props.onError(err, 'Userchallenges._subscribeToNewchallengeEvent');
    //   });
    DSportRank.events.Newchallenge({
   filter: {_from: web3.utils.keccak256(username)},
   fromBlock: 1
        }, (err, event) => {
         if (err){
           this.props.onError(err, 'Userchallenges._subscribeToNewchallengeEvent');
         }
      })
  }

  /**
   * Formats an int date into a displayable date
   * @param {Number} intDate - date in seconds
   * @returns {String} prettyfied date
   */
  _formatDate(intDate){
    const padZeros = 13 - intDate.length;
    if(padZeros > 0){
      intDate *= Math.pow(10, padZeros);
    }
    return formatDistance(new Date(intDate), new Date()) + ' ago';
  }
  //#endregion

  //#region React lifecycle events
  /**
   * Get the user details and subscribe to their challenge event
   */
  componentDidMount(){
    EmbarkJS.onReady((err) => {
      this._init();
    });
  }

  /**
   * If the username was changed (ie redirected from a new route),
   * we need to get the new user's details and subscribe to their challenge
   * event.
   */
  componentDidUpdate(prevProps){
    if(this.props.match.params.username !== prevProps.match.params.username){
      this._init();
    }
  }

  /**
   * Unsubscribe from our challenge event so we stop
   * receiving challenges.
   */
  componentWillUnmount(){
    if(!this.event) return;
    // TODO: check if this is the 'right' way to remove / stop the event listener
    this.event.removeListener(this.event);
  }

  render(){
    const {user} = this.state;

    if (user === {}) {
      // Render loading state ...
      return (<Grid><Row><Col xs={12}>Loading...</Col></Row></Grid>);
    } else if (user.username === ''){
      return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>{ this.props.match.params.username } <small>does not exist!</small></PageHeader>
          </Col>
        </Row>
      </Grid>);
    }else {
      // Render real UI ...
      const {username, description, picture, creationDate} = user;
      const challengeList = this.state.challenges.map(function(challenge, index){
                          return <ListGroupItem className='challenge' key={ index } header={ challenge.time }>{ challenge.content }</ListGroupItem>
                        });
      return (
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>{ username } s <small>challenges</small></PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Thumbnail src={picture} alt={username} className='profilePic'>
                <h3>{ username }</h3>
                <p>{ description }</p>
                <p className='created'>Created { creationDate }</p>
              </Thumbnail>

            </Col>
            <Col xs={8}>
              <ListGroup className='challenges'>
                { challengeList }
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      )
    }
  }
  //#endregion
}
export default Userchallenges
