import { Grid, Row, Col, Thumbnail, ListGroup, ListGroupItem, PageHeader, Button } from 'react-bootstrap';
import React, { Component } from 'react';
import imgAvatar from '../../img/avatar-default.png';
import { formatDistance } from 'date-fns/esm'
import { EventEmitter } from 'events';
import { withRouter } from 'react-router-dom'
import EmbarkJS from 'Embark/EmbarkJS';

// Original: The Player looks up the player using the number parsed from
// the URL's pathname. If no player is found with the given
// number, then a "player not found" message is displayed.

//New: The player gets all his ranking lists from the contract
class Userrankings extends Component {

  //#region Constructor
  constructor(props, context){
    super(props, context);
    this.state = {
      user: {},
      rankings: []
    };
    this.event = null;
    this._subscribeToNewRankingEvent = this._subscribeToNewRankingEvent.bind(this);
  }
  //#endregion

  //#region Helper methods
  /**
   * Get the user details and subscribe to their ranking event
   */
  _init(){
    console.log(0)
    const { username } = this.props.match.params;
    console.log('username')
    console.log(this.props.match.params)
    this._getUserDetails(username);

    // subscribe to ranking events
    //this._subscribeToNewRankingEvent = this._subscribeToNewRankingEvent().bind(this);
    this._subscribeToNewRankingEvent(username);
    console.log(this.state.rankings);
    //this.getUserRankings(username);
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
   * Subscribes to a ranking event from the contract.
   * When a ranking is received, it is appended to the list of
   * rankings.
   *
   * @param {String} username
   * @returns {null}
   */

   _subscribeToNewRankingEvent(username){
     console.log('_subscribeToNewRankingEvent');
     const usernameHash = web3.utils.keccak256(username);
     console.log(this.state.rankings);
     //console.log(username);
     this.event = DSportRank.events.Newranking({
        filter: {_from: usernameHash},
        fromBlock: 1
      }, (err, event) => {
        if (err){
          console.log('first err');
          // console.log(this.event);
          //   console.log(this.props);
          this.props.onError(err, 'Userrankings._subscribeToNewRankingEvent');
        }
     })
       .on('data', (event) => {
         let rankings = this.state.rankings;
         //this.rankings = this.rankings.bind(this);
         console.log(rankings);
         rankings.push({
           content: event.returnValues.rankings,
           time: this._formatDate(event.returnValues.time)
         });

         this.setState({rankings: rankings});
       })
       .on('error', function(error){
         console.log('second err');
         this.props.onError(err, 'UserRankings._subscribeToNewRankingEvent');
       });
 }

//get the ranking list from the ranking [] in the contract
 getUserRankings(){
   console.log(1)
   const rankingList = ['MyClub', '1312234'];
   this.setState({rankings: rankingList});
   return null;
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
  /**
   * Get the user details and subscribe to their ranking event
   */
  componentDidMount(){
    EmbarkJS.onReady((err) => {
      console.log(3)
      this._init();
    });
  }

  /**
   * If the username was changed (ie redirected from a new route),
   * we need to get the new user's details and subscribe to their ranking
   * event.
   */
  componentDidUpdate(prevProps){
    if(this.props.match.params.username !== prevProps.match.params.username){
      this._init();
    }
  }

  /**
   * Unsubscribe from our ranking event so we stop
   * receiving rankings.
   */
  componentWillUnmount(){
    if(!this.event) return;
    // TODO: check if this is the 'right' way to remove / stop the event listener
    //this.event.removeListener(this.event);
    this.event.unsubscribe();
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
      //REVIEW: class name left as 'tweet' assuming compatibility required?
      const rankingList = this.state.rankings.map(function(ranking, index){
                          return <ListGroupItem className='tweet' key={ index } header={ ranking.RANKINGNAME }>{ ranking.RANKINGDESC }</ListGroupItem>
                        });
      return (
        <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8} xsOffset={3} >
            <Button
              bsStyle="primary"
              //disabled={ !isValid }
              //onClick={ !isValid ? null : (e) => this._handleClick(e) }
              onClick={ (e) => this._cancelClick(e) }
            >
            Cancel
            </Button>
          </Col>
        </Row>
          <Row>
            <Col xs={12}>
              <PageHeader>{ username } s <small>rankings</small></PageHeader>
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
              <ListGroup className='tweets'>
                { this.state.rankings }
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      )
    }
  }
  //#endregion
}
export default Userrankings
