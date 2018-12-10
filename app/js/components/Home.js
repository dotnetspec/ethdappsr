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

//import testData from "../../json/Rankings.json";

//REVIEW: Global variables
//currently only assigned when click challenge... button
 let currentUserRank = 0;
 let opponentUserRank = 0;

 //REVIEW: May be able to improve setting rank with similar to:
 //this.setState((state, props) => ({
//   counter: state.counter + props.increment
// }));
//i.e. setting state by passing a function
//https://reactjs.org/docs/state-and-lifecycle.html

/**
 * Functionality representing the table search properties
 *
 *
 */
//REVIEW: selectRowPropAfterClickRow had to be created separately from selectRowProp to handle the row data
//after selecting a row
const selectRowPropAfterClickRow = {
  selectedOpponentName: '',
  selected: [],
  selectedOpponentRank: ''
};

const qualityType = {
  0: 'AVAILABLE',
  1: 'player'
};

function enumFormatter(cell, row, enumObject) {
  console.log(enumObject[cell])
  return enumObject[cell];
}
  //#endregion

//REVIEW: Possibly re-factor to clarify code in the Home component
class UserPlayerJsonData extends Component {
   render() {
      // details is all the object -> array data coming from the data prop sent from Home
      //using the object.keys code
        const { details} = this.props;
        let textToDisplayRank = '';
        let textToDisplayChallenger = '';
        let textToDisplayContinue = '';

        const currentUserRank = details.RANK;
        const currentChallengerName = details.CURRENTCHALLENGERNAME;

      textToDisplayRank = 'Your current rank is: ' + currentUserRank;
        //console.log(details.RANK);
          if (details.NAME === this.props.username && details.ACTIVE === true)
            {
                //console.log(details.RANK);
                if(currentChallengerName != 'AVAILABLE'){
                  textToDisplayChallenger = 'Your current challenger is: ' + currentChallengerName;
                  textToDisplayContinue =   'Enter a result against ' + currentChallengerName + ' to continue'

                }else{
                    textToDisplayChallenger += 'You do NOT currently have a challenge'
                    textToDisplayContinue += 'Please select an AVAILABLE opponent (below) to challenge: '
                }

              return (
                <div>
                    { textToDisplayRank }
                  <p></p>
                    { textToDisplayChallenger }
                  <p></p>
                    { textToDisplayContinue }
                </div>)
             }else

             if (details.NAME === this.props.username && details.ACTIVE === false){
                 //this.setState({ activateText: 'Your account currently has no player associated with it' });
                //this.props.history.push('/update/@' + this.props.username);
               return (
                 <div>
                   Your player is currently deactivated!<p></p>
                   Click Reactivate (top  menu) to re-enter the rankings (at the bottom)
                </div>)
               ;}
               else {
                   //this.setState({ activateText: 'Your account currently has no player associated with it' });
                  //this.props.history.push('/update/@' + this.props.username);
                 return (
                  null)
                 ;}
           }
}

//NB: this function gets called from sibling Header.js
//to clear the warning text when user changes account
//based on info from
//https://www.codeproject.com/Tips/1215984/Update-State-of-a-Component-from-Another-in-React
export function updateText(warningText) {
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
      rank: 0
    }
    this.tablesortoptions = {
     defaultSortName: 'RANK',  // default sort column name
     defaultSortOrder: 'asc'  // default sort order


   };

    updateText = updateText.bind(this);
   //REVIEW: not sure about comment below...
   //_handleClose must be bound if it's going to be used in child components (it is)
   //this._handleClose = this._handleClose.bind(this);
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
    //TODO: make current user unselectable
    if(selectRowPropAfterClickRow.selectedOpponentName === this.props.user){
      this.setState({ warningText: ' You cannot challenge yourself!' });
      this.setState({ WarningModalIsOpen: true });
    }else if(JSONops.isPlayerAlreadyChallengingThisOpp(this.props.rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user)){
        this.setState({ warningText: ' You are already challenging this player!' });
        this.setState({ WarningModalIsOpen: true });
    }else if(!JSONops.isPlayerAvailableToChallenge(this.props.rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user)){
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
//
//

onClickChallengeSelected(cell, row, rowIndex){
  //console.log('Product #', rowIndex);
  selectRowPropAfterClickRow.selectedOpponentName = `${row['NAME']}`;
  selectRowPropAfterClickRow.selectedOpponentRank = `${row['RANK']}`;
    if(this.props.user != ''){
      this._handleShowChallengeModal();
    }else{
        this.setState({ warningText: 'Error: Sorry your account is not recognized' });
        this.setState({ openWarningModal: true });
    }
 }

 onClickResultSelected(cell, row, rowIndex){
   //console.log('Product #', rowIndex);
   selectRowPropAfterClickRow.selectedOpponentName = `${row['NAME']}`;
   selectRowPropAfterClickRow.selectedOpponentRank = `${row['RANK']}`;
   this.openResultModal();
   //this._handleShowChallengeModal();
  }

// TODO: Challenge/Enter button should be part of onrowselect, not a separate button
//REVIEW: selectRowProp has to be defined in render for the onSelect to be bound to the
//onSelectRow function within this component. This is not fully understood and needs to be
//better understood
//https://github.com/AllenFang/react-bootstrap-table/issues/1035

challengeButton(cell, row, enumObject, rowIndex) {
    return (
       <button
          type="button"
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
           type="button"
           onClick={() =>
           this.onClickResultSelected(cell, row, rowIndex)}
        >
        Result
        </button>
     )
  }

  openResultModal = () => {
    //NB: this is a NOT operation!
    if(!JSONops.isPlayerAvailableToEnterResultAgainst(this.props.rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName, this.props.user))
  {
    console.log(1)
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

  componentDidMount(){
    // const userRank = JSONops._getUserValue(this.props.rankingJSONdata, this.props.user , "RANK");
    // console.log(userRank)
    //   this.setState({ rank: userRank });
  }



  render() {
    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      unselectable: [0],
      selected: [],
      //onSelect: this.onSelectRow.bind(this),
      bgColor: 'gold'
    };

    return (
      <div>

      <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Would you like to challenge {selectRowPropAfterClickRow.selectedOpponentName} who is ranked {selectRowPropAfterClickRow.selectedOpponentRank}?<p></p>
         <DoChallenge onAfterChallenge={(e) => this._handleClose()}
          data={this.props.rankingJSONdata}
          selectedOpponentName={selectRowPropAfterClickRow.selectedOpponentName}
          user={this.props.user}>
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
        data={this.props.rankingJSONdata}
        selectedOpponentRank={selectRowPropAfterClickRow.selectedOpponentRank}
        currentUserRank={currentUserRank}
        user={this.props.user}
        selectedOpponentName={selectRowPropAfterClickRow.selectedOpponentName}
        onAfterChallenge={this.closeResultModal}>
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
          <h2>{this.props.user}</h2><p></p>
          <h3>{Object.keys(this.props.rankingJSONdata).map(key => (
         <UserPlayerJsonData key={key} details={this.props.rankingJSONdata[key]} username={this.props.user}/>
      ))}
      <font color="red">{this.state.warningText}</font><p></p></h3>

      <div>

     {/* http://allenfang.github.io/react-bootstrap-table/example.html#sort */}

        <BootstrapTable options={ this.tablesortoptions } data={this.props.rankingJSONdata}
        >
              <TableHeaderColumn  isKey dataField='id'
              hidden>
                ID
              </TableHeaderColumn>
              <TableHeaderColumn  dataField='NAME'
              filter={ { type: 'TextFilter', defaultValue: '' } }
              >
                Player Name
              </TableHeaderColumn>
              <TableHeaderColumn  dataField='RANK' dataSort
              width={'7%'}
              >
                Rank
              </TableHeaderColumn>

              <TableHeaderColumn dataField='CURRENTCHALLENGERNAME'

              filter={ { type: 'TextFilter',  defaultValue: '' } }
              >
               Current Challenger
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
