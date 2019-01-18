import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { NavLink, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit';
import Chance from "chance"
import DoChallenge from './DoChallenge'
import EnterResult from './EnterResult'
import JSONops from './JSONops'

 //REVIEW: May be able to improve setting rank with similar to:
 //this.setState((state, props) => ({
//   counter: state.counter + props.increment
// }));
//i.e. setting state by passing a function
//https://reactjs.org/docs/state-and-lifecycle.html

/**
 * Functionality representing the table search properties
 */
//REVIEW: selectRowPropAfterClickRow had to be created separately from selectRowProp to handle the row data
//after selecting a row
const selectRowPropAfterClickRow = {
  selectedOpponentName: '',
  selected: [],
  selectedOpponentRank: ''
};

//REIVEW: potentially used as selector for the table,
//but currenlty unused
// const qualityType = {
//   0: 'AVAILABLE',
//   1: 'player'
// };

//REIVEW: potentially used as selector for the table,
//but currenlty unused
// function enumFormatter(cell, row, enumObject) {
//   console.log(enumObject[cell])
//   return enumObject[cell];
// }
  //#endregion

//REVIEW: Possibly re-factor to clarify code in the Home component
// class UserPlayerJsonData extends Component {
//    render() {
//       // details is all the object -> array data coming from the data prop sent from Home
//       //using the object.keys code
//         const { details} = this.props;
//         const textToDisplayRankName = JSONops._getGlobalRankingVal(this.props.rankingListJSONdata, this.props.newrankIdCB, 'RANKINGNAME')
//         const textToDisplayRankDesc = JSONops._getGlobalRankingVal(this.props.rankingListJSONdata, this.props.newrankIdCB, 'RANKINGDESC')
//         let textToDisplayRank = '';
//         let textToDisplayChallenger = '';
//         let textToDisplayContinue = '';
//
//         //console.log(details);
//
//         //if the json is empty do nothing
//         if (details === null){
//           console.log('json is empty 2');
//           return null;
//         }
//
//         const currentUserRank = details.RANK;
//         const currentChallengerName = details.CURRENTCHALLENGERNAME;
//
//       textToDisplayRank = 'Your current rank is: ' + currentUserRank;
//         //console.log(details.RANK);
//           if (details.NAME === this.props.username && details.ACTIVE === true)
//             {
//                 //console.log(details.RANK);
//                 if(currentChallengerName != 'AVAILABLE'){
//                   textToDisplayChallenger = 'Your current challenge is VS ' + currentChallengerName;
//                   textToDisplayContinue =   'Enter a result against ' + currentChallengerName + ' to continue'
//
//                 }else{
//                     textToDisplayChallenger += 'You do NOT currently have a challenge'
//                     textToDisplayContinue += 'Please select an AVAILABLE opponent (below) to challenge: '
//                 }
//
//               return (
//                 <div>
//                     {this.props.username}
//                   <p></p>
//                     { textToDisplayRankName }
//                   <p></p>
//                     { textToDisplayRankDesc }
//                   <p></p>
//                     { textToDisplayRank }
//                   <p></p>
//                     { textToDisplayChallenger }
//                   <p></p>
//                     { textToDisplayContinue }
//                 </div>)
//              }else
//
//              if (details.NAME === this.props.username && details.ACTIVE === false){
//                  //this.setState({ activateText: 'Your account currently has no player associated with it' });
//                 //this.props.history.push('/update/@' + this.props.username);
//                return (
//                  <div>
//                    Your player is currently deactivated!<p></p>
//                    Click Reactivate (top  menu) to re-enter the rankings (at the bottom)
//                 </div>)
//                ;}
//                else {
//                    //this.setState({ activateText: 'Your account currently has no player associated with it' });
//                   //this.props.history.push('/update/@' + this.props.username);
//                  return (
//                   null)
//                  ;}
//            }
// }




//NB: this function gets called from sibling Header.js
//to clear the warning text when user changes account
//based on info from
//https://www.codeproject.com/Tips/1215984/Update-State-of-a-Component-from-Another-in-React
export function updateWarningText(warningText) {
    this.setState({warningText})
}

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */
class Home extends Component{

  //#region Constructor
  constructor(props, context){
    super(props, context);
    this.state = {
      showModal: false,
      ResultModalIsOpen: false,
      WarningModalIsOpen: false,
      warningText: '',
      rank: 0,
      contactNoCB:'',
      emailCB:'',
      data:''
    }

    this.tablesortoptions = {
     defaultSortName: 'RANK',  // default sort column name
     defaultSortOrder: 'asc'  // default sort order
   };

   const { rankingDefault } = this.props;
   console.log('rankingDefault in home',rankingDefault)
   //bind the callbacks (defined above) to this parent component Home
   //so that DoChallenge changes are updated in UI:
    updateWarningText = updateWarningText.bind(this);
  }
  //#endregion

  /**
   * Hides the challenge modal
   */
  _handleClose() {
    this.setState({ showModal: false });
  }
  /**
   * Shows the challenge modal
   */
  _handleShowChallengeModal() {
    const { rankingJSONdata } = this.props;
    if(selectRowPropAfterClickRow.selectedOpponentName === this.props.user.username){
      this.setState({ warningText: ' You cannot challenge yourself!' });
      this.setState({ WarningModalIsOpen: true });
    }else if(!JSONops.isPlayerLowerRankThanChallengeOpponent(rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user.username)){
        this.setState({ warningText: ' This opponent is lower than you in the rankings - aim high!' });
        this.setState({ WarningModalIsOpen: true });
    }else if(JSONops.isPlayerAlreadyChallengingThisOpp(rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user.username)){
        this.setState({ warningText: ' You are already challenging this player!' });
        this.setState({ WarningModalIsOpen: true });
    }else if(!JSONops.isPlayerAvailableToChallenge(rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user.username)){
        this.setState({ warningText: ' Please allow ongoing challenge(s) to complete ...' });
        this.setState({ WarningModalIsOpen: true });
    }
    else{
      this.setState({ showModal: true });
      this.setState({ warningText: '' });
      }
}



//TODO: use https://reactjs.org/docs/faq-state.html
//and code below for better setting of rank in state (perhaps?)
// setStateOfRank() {
//   this.setState((state) => {
//     // Important: read `state` instead of `this.state` when updating.
//     return {rank: state.count + 1}
//   });
// }

onClickChallengeSelected(cell, row, rowIndex){
  selectRowPropAfterClickRow.selectedOpponentName = `${row['NAME']}`;
  selectRowPropAfterClickRow.selectedOpponentRank = `${row['RANK']}`;
  console.log('this.props.user.rankings')
  console.log(this.props.user.chanllenges)
    if(this.props.user.username != ''){
      this._handleShowChallengeModal();
    }else{
        this.setState({ warningText: 'Error: Sorry your account is not recognized' });
        this.setState({ openWarningModal: true });
    }
 }

 onClickResultSelected(cell, row, rowIndex){
   selectRowPropAfterClickRow.selectedOpponentName = `${row['NAME']}`;
   selectRowPropAfterClickRow.selectedOpponentRank = `${row['RANK']}`;
   this.openResultModal();
  }

// TODO: Challenge/Enter button should be part of onrowselect, not a separate button
//REVIEW: selectRowProp has to be defined in render for the onSelect to be bound to the
//onSelectRow function within this component. This is not fully understood and needs to be
//better understood
//https://github.com/AllenFang/react-bootstrap-table/issues/1035

challengeButton(cell, row, enumObject, rowIndex) {
    return (
       <button
          bsstyle="primary"
          //type="button"
          onClick={() =>
          this.onClickChallengeSelected(cell, row, rowIndex)}
       >
       Challenge
       </button>
    )
 }

 resultButton(cell, row, enumObject, rowIndex) {
     return (
        <button
          bsstyle="primary"
           //type="button"
           onClick={() =>
           this.onClickResultSelected(cell, row, rowIndex)}
        >
        Result
        </button>
     )
  }

  openResultModal = () => {
    //NB: this is a NOT operation!
    const { rankingJSONdata } = this.props;
    if(!JSONops.isPlayerAvailableToEnterResultAgainst(rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user.username))
    {
        this.setState({ warningText: 'You must challenge an opponent before attempting to enter a result!' });
        this.setState({ WarningModalIsOpen: true });
    }else{
      this.setState({ ResultModalIsOpen: true });
      this.setState({ warningText: '' });
    }
  };

  closeResultModal = () => {
    this.setState({ ResultModalIsOpen: false });
  };

  closeWarningModal = () => {
    this.setState({ WarningModalIsOpen: false });
  };

//REVIEW: Managing display here might be handled differently:
//this was originally a component - perhaps it still should be [?]
  userPlayerJsonDataDisplay(){
    const textToDisplayRankName = JSONops._getGlobalRankingVal(this.props.rankingListJSONdata, this.props.newrankIdCB, 'RANKINGNAME')
    const textToDisplayRankDesc = JSONops._getGlobalRankingVal(this.props.rankingListJSONdata, this.props.newrankIdCB, 'RANKINGDESC')
    let textToDisplayRank = '';
    let textToDisplayChallenger = '';
    let textToDisplayContinue = '';
    //if the json is empty do nothing
    if (this.props.rankingJSONdata[0] === null){
      console.log('json is empty inside userPlayerJsonDataDisplay');
      return null;
    }

    const currentUserRank = JSONops._getUserValue(this.props.rankingJSONdata, this.props.user.username, "RANK");
    const currentChallengerName = JSONops._getUserValue(this.props.rankingJSONdata, this.props.user.username, "CURRENTCHALLENGERNAME");

    textToDisplayRank = 'Your current rank is: ' + currentUserRank;

      const currentUserName = JSONops._getUserValue(this.props.rankingJSONdata, this.props.user.username, "NAME");
      const activeBool = JSONops._getUserValue(this.props.rankingJSONdata, this.props.user.username, "ACTIVE");
      if (currentUserName === this.props.user.username && activeBool)
        {
            //console.log(details.RANK);
            if(currentChallengerName != 'AVAILABLE'){
              textToDisplayChallenger = 'Your current challenge is VS ' + currentChallengerName;
              textToDisplayContinue =   'Enter a result against ' + currentChallengerName + ' to continue'

            }else{
                textToDisplayChallenger += 'You do NOT currently have a challenge'
                textToDisplayContinue += 'Please select an AVAILABLE opponent (below) to challenge: '
            }

          return (
            <div>
              <h2>
                { textToDisplayRankName }
              </h2>
              <h4>
                { textToDisplayRankDesc }
              </h4>
                {this.props.user.username}
              <p></p>
                { textToDisplayRank }
              <p></p>
                { textToDisplayChallenger }
              <p></p>
                { textToDisplayContinue }
            </div>)
          }else
            if (currentUserName === this.props.user.username && !activeBool){
              return (
                <div>
                  Your player is currently deactivated!<p></p>
                  Click Reactivate (top  menu) to re-enter the rankings (at the bottom)
               </div>)
              ;}
              else {
                return (
                 null)
                ;}
  }

//NB: none of this code is currently running on a re-set (get rid?)
  preprocessDataBeforeRender(){
    //if there is a username but it's not listed in the json, add this user to the current list
    //REVIEW: This test may be more consistently handled
    console.log('this.props.loadingJSON', this.props.loadingJSON)
    if(this.props.user.username != ''
    && !JSONops.isPlayerListedInJSON(this.props.rankingJSONdata, this.props.user.username)
    && this.props.loadingJSON === false
    && this.props.viewingOnlyCB === false
    ){
      console.log('createNewUserInJSON in preprocessDataBeforeRender in home.js')
      console.log('this.props.rankingID in preprocessDataBeforeRender in home.js', this.props.newrankIdCB)
        JSONops.createNewUserInJSON(this.props.rankingJSONdata, this.props.user.username, this.props.contactno, this.props.email,this.props.account, this.props.description, this.props.newrankIdCB);
        console.log('player created')
    }
    const { rankingDefault } = this.props;
    console.log('rankingDefault in home/preprocessDataBeforeRender',rankingDefault)
    if(rankingDefault === '5c36f5422c87fa27306acb52'){
        console.log('returning null in home/preprocessDataBeforeRender')
      return null;
    }
    console.log('this.props.isRankingIDInvalid in preprocessDataBeforeRender in home', this.props.isRankingIDInvalid)
    if(this.props.isRankingIDInvalid){
      this.props.history.push('/create');
    }

    if (JSONops.isJSONEmpty(this.props.rankingJSONdata) && this.props.user.username === null){

      console.log('json is empty and there is no username');
      this.props.history.push('/create');
      return null;
      //(<div>No Data To Display - Please select an account (top right) to create a player</div>);
    }
    //if the player isn't listed in the json then add them (only if user clicked 'join')
    if(!JSONops.isPlayerListedInJSON(this.props.rankingJSONdata, this.props.user.username)
  && this.props.viewingOnlyCB === false ){
      //originalData, username, contactno, email, accountno, description, rankingID)
      JSONops.createNewUserInJSON(this.props.rankingJSONdata, this.props.user.username, this.props.contactno, this.props.email, this.props.account, this.props.description, this.props.newrankIdCB)
    }

  }

  bootstrapTableDisplay(){
      //if the json is empty and no account re-direct to create user
      console.log('this.props.rankingJSONdata', this.props.rankingJSONdata)
      // console.log(this.props.rankingJSONdata[0])
      // console.log('this.props.user.username')
      // console.log(this.props.user.username)
      //REVIEW: this should only occur after an Embark re-set and there's no
      //inital account or data - there may be a better way to test for this

      //if (this.props.rankingJSONdata[0] === null && this.props.user.username === null){
      if (JSONops.isJSONEmpty(this.props.rankingJSONdata) && this.props.user.username === null){

        console.log('json is empty and there is no username');
        this.props.history.push('/create');
        return null;
        //(<div>No Data To Display - Please select an account (top right) to create a player</div>);
      } else {
      return (
        <BootstrapTable options={ this.tablesortoptions } data={this.props.rankingJSONdata}
        >
              <TableHeaderColumn  isKey dataField='id'
              hidden>
                ID
              </TableHeaderColumn>

              <TableHeaderColumn  dataField='NAME'
              filter={ { type: 'TextFilter', defaultValue: '' } }
              >
                Player Name (Filter)
              </TableHeaderColumn>

              <TableHeaderColumn  dataField='RANK' dataSort
              width={'7%'}
              >
                Rank
              </TableHeaderColumn>

              <TableHeaderColumn dataField='CURRENTCHALLENGERNAME'
              filter={ { type: 'TextFilter',  defaultValue: '' } }
              >
               Current Challenger (Filter)
              </TableHeaderColumn>

              <TableHeaderColumn
              dataField='button'
              dataFormat={this.challengeButton.bind(this)}
            >
              Challenge
              </TableHeaderColumn>

              <TableHeaderColumn
              dataField='button'
              dataFormat={this.resultButton.bind(this)}
            >
              Enter Result
              </TableHeaderColumn>

              <TableHeaderColumn dataField='ACTIVE'
              filter={ { type: 'TextFilter', defaultValue: 'true' } }
              hidden
              >
                Active?
              </TableHeaderColumn>

            </BootstrapTable>
          )
        }
  }

//   sendCreateNewRankingJSONData(){
//       let response = '';
//       let httpString = "https://api.jsonbin.io/b/";
//       let rankingID = '';
//       let jsonToSend = '{"RANKINGID":"';
//       let req = new XMLHttpRequest();
//
//           req.onreadystatechange = () => {
//             if (req.readyState == XMLHttpRequest.DONE) {
//               console.log(req.responseText);
//               response = req.responseText;
//               console.log('response')
//               console.log(response)
//               rankingID = JSONops.getIdNoFromJsonbinResponse(response);
//               console.log('rankingID')
//                console.log(rankingID)
//                //httpString += rankingID;
//                jsonToSend += rankingID + '"}';
//                console.log(jsonToSend)
//                jsonToSend = JSON.parse(jsonToSend);
//               //this._sendJSONDataWithRankingID(jsonToSend, rankingID);
//               //re-send the response with the new id inserted
//
//             }
//           };
//
//            rankingID = JSONops.getIdNoFromJsonbinResponse(response);
//            console.log('rankingID b4')
//             console.log(rankingID)
//            httpString += rankingID;
//            jsonToSend += rankingID + '"}';
//            console.log(jsonToSend)
//            jsonToSend = JSON.parse(jsonToSend);
//            console.log('httpString')
//          console.log(httpString)
//
//           //  req.open("POST", httpString, true);
//           //  req.setRequestHeader("Content-type", "application/json");
//           // response = req.send('{"RANKINGID": "' + rankingID + '"}');
//           req.open("POST", httpString, true);
//           req.setRequestHeader("Content-type", "application/json");
//          //response = req.send('{"RANKINGID": "' + rankingID + '"}');
//          response = req.send(jsonToSend);
//           //response = req.send();
//
//            return null;
//            //return response;
//
// }

  // componentDidMount(){
  // }
  //
  // componentWillReceiveProps(nextProps){
  //   this.setState({data: this.props.rankingJSONdata})
  // }

  render() {
    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      unselectable: [0],
      selected: [],
      bgColor: 'gold'
    };

      this.preprocessDataBeforeRender();


    const { username } = this.props.user;

    let isError = this.props.error && this.props.error.message;
    //XXX: temp to run
    isError = false;
    //NB: Boolean forces this.props.account to be a Boolean
    const isLoading = !Boolean(this.props.account) && !isError;

    // console.log('isLoading in home')
    // console.log(isLoading)
    // console.log('this.props.account')
    // console.log(this.props.account)
    // console.log('isError')
    // console.log(isError)

    let states = {};

    // state when we are waiting for the App component to finish loading
    // the current account (address) from web3.eth.getAccounts()
    states.isLoading = <Spinner name="pacman" color="white" fadeIn='none' />;

    states.isError = <span className='error'>ERROR!</span>;


const { rankingJSONdata, contactNoCB, emailCB } = this.props;
    return (
      <div>

      <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Would you like to challenge {selectRowPropAfterClickRow.selectedOpponentName} who is ranked {selectRowPropAfterClickRow.selectedOpponentRank}?<p></p>
         <DoChallenge onAfterChallenge={(e) => this._handleClose()}
          data={rankingJSONdata}
          selectedOpponentName={selectRowPropAfterClickRow.selectedOpponentName}
          user={this.props.user.username}
          updateTextCB={this.updateText}
          updatedExtAcctBalCB={this.props.updatedExtAcctBalCB}
          newrankIdCB={this.props.newrankIdCB}
          >
          </DoChallenge>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => this._handleClose(e)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal
          show={this.state.ResultModalIsOpen}
        >
        <Modal.Header closeButton>
          <Modal.Title>Please enter your result vs {selectRowPropAfterClickRow.selectedOpponentName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <EnterResult
        data={rankingJSONdata}
        selectedOpponentRank={selectRowPropAfterClickRow.selectedOpponentRank}
        user={this.props.user.username}
        selectedOpponentName={selectRowPropAfterClickRow.selectedOpponentName}
        onAfterChallenge={this.closeResultModal}
        newrankIdCB={this.props.newrankIdCB}
        >
        </EnterResult>
        </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeResultModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal
            show={this.state.WarningModalIsOpen}
          >
          <Modal.Header closeButton>
            <Modal.Title>Please Note!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <font color="red">{this.state.warningText}</font>
          </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeWarningModal}>Close</Button>
            </Modal.Footer>
          </Modal>

        <Grid>
          <Row>
          {isLoading ?
            states.isLoading
            :
            isError ?
              states.isError
              :
              this.userPlayerJsonDataDisplay()
            }
              <div>
             {/* http://allenfang.github.io/react-bootstrap-table/example.html#sort */}
              <h3>{this.props.contactNoCB}</h3>
              <h3>{this.props.emailCB}</h3>
              {this.bootstrapTableDisplay()}
                  </div>

            <Col xs={12}>
              <PageHeader>

              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>

            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  //#endregion
}

export default Home
