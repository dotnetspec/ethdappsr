import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { NavLink, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit';
import Chance from "chance"
import DoChallenge from './DoChallenge'
import EnterResult from './EnterResult'
//import testData from "../../json/Rankings.json";

//REVIEW: Global variable
//currently only assigned when click challenge... button
 let currentUserRank = 0;
 let opponentUserRank = 0;

 //REVIEW: May be able to improve setting rank with similar to:
 //this.setState((state, props) => ({
//   counter: state.counter + props.increment
// }));
//i.e. setting state by passing a function
//https://reactjs.org/docs/state-and-lifecycle.html

 const selectRowProp = {
   mode: 'radio',
   selectedOpponentName: '',
   clickToSelect: true,
   unselectable: [0],
   selected: [],
   onSelect: onSelectRow,
   bgColor: 'gold',
   selectedOpponentRank: ''
 };

 function onSelectRow(row, isSelected, e) {
      if (isSelected) {
        selectRowProp.selectedOpponentName = `${row['NAME']}`;
        selectRowProp.selectedOpponentRank = `${row['RANK']}`;
      }
    }


//REVIEW: Possibly unnecessary re-rendering
class UserPlayerJsonData extends Component {
   render() {
      // details is all the object -> array data coming from the data prop sent from Home
      //using the object.keys code
        const { details } = this.props;
        //console.log(details.RANK);
          if (details.NAME === this.props.username)
    {
      //console.log(details.RANK);
      currentUserRank = details.RANK;

      return (
        <div>
          {details.RANK}
       </div>);
     }else{return (null)
       ;}
   }
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
      warningText: ''
    }
    this.tablesortoptions = {
     defaultSortName: 'RANK',  // default sort column name
     defaultSortOrder: 'asc'  // default sort order
};
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
  _handleShow() {
    if(selectRowProp.selectedOpponentName != this.props.user){
    this.setState({ showModal: true });
  }else{
    console.log('try');
      this.setState({ warningText: ' You cannot challenge yourself!' });
      return (
      <div>
       You can't challenge yourself!
      </div>
    );
    }
}

  //find the user entry in the json return id, name and Rank
  // _findUserInJson(username){
  //   // Object.keys(PlayerData).map(key => (
  //   //     <Issue key={key} details={PlayerData[key]} />
  //   //   ))
  //   return username;
  // }

//   Your current ranking is:
//   {Object.keys(this.props.rankingJSONdata).map(key => (
//  <UserPlayerJsonData key={key} details={this.props.rankingJSONdata[key]} username={this.props.user}/>
// ))}

  // _getUserRank(){
  //   const jsondata = this.state.data;
  // //  const username = this.state.user;
  //   //console.log(username);
  //   var arr = [];
  //   //Object.keys(jsondata).forEach(function(key) {
  //     Object.keys(this.props.rankingJSONdata).map(key => {
  //     console.log(this.props.rankingJSONdata[key].NAME);
  //     console.log(this.props.user);
  //
  //     if (this.props.rankingJSONdata[key].NAME === this.props.user){
  //      arr.push(this.props.rankingJSONdata[key]);
  //     }
  //   });
  //    console.log(arr[0].RANK);
  //    //return arr[0].RANK;
  // }

// TODO: Challenge/Enter button should be part of onrowselect, not a separate button
  render() {
    return (
      <div>
      <Button bsStyle="primary" onClick={(e) => this._handleShow(e)}>
        Challenge/Enter Result vs Selected Opponent
      </Button>
      <p></p>
      <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        Would you like to challenge {selectRowProp.selectedOpponentName} who is ranked {selectRowProp.selectedOpponentRank}?<p></p>
         <DoChallenge selectedOpponentName={selectRowProp.selectedOpponentName}
          onAfterChallenge={(e) => this._handleClose()}></DoChallenge>

              Or enter the result from your last ladder match with {selectRowProp.selectedOpponentName}:

          <EnterResult
          data={this.props.rankingJSONdata}
          selectedOpponentRank={selectRowProp.selectedOpponentRank}
          currentUserRank={currentUserRank}
          user={this.props.user}
          selectedOpponentName={selectRowProp.selectedOpponentName}
          onAfterChallenge={(e) => this._handleClose()}></EnterResult>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => this._handleClose(e)}>Close</Button>
        </Modal.Footer>
      </Modal>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>
              {this.state.warningText}<p></p>
                {this.props.user}<p></p>
                Your current ranking is:
                {Object.keys(this.props.rankingJSONdata).map(key => (
               <UserPlayerJsonData key={key} details={this.props.rankingJSONdata[key]} username={this.props.user}/>
            ))}
            <small>Select an opponent to challenge or enter a result against:</small>
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
            <div>

           {/* http://allenfang.github.io/react-bootstrap-table/example.html#sort */}

              <BootstrapTable options={ this.tablesortoptions } data={this.props.rankingJSONdata}
                    selectRow={ selectRowProp }
                  >
                    <TableHeaderColumn isKey dataField='id'
                    hidden>
                      ID
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='NAME'
                    >
                      Name
                    </TableHeaderColumn>
                    <TableHeaderColumn  dataField='RANK' dataSort
                    >
                      Rank
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='CURRENTCHALLENGERID'
                    >
                      Current Challenger
                    </TableHeaderColumn>

                  </BootstrapTable>
                </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  //#endregion
}

export default Home
