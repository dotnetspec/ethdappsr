import { Switch, Route } from 'react-router-dom';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import PropsRoute from './PropsRoute';
import Home from './Home';
import Userchallenges from './Userchallenges';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import DeactivatePlayer from './DeactivatePlayer';
import Error from './Error';
import React, { Component } from 'react';
import JSONops from './JSONops'
import CreateNewRanking from './CreateNewRanking';
import UserRankings from './UserRankings'
import {newrankIdCB, viewingOnlyCB} from './App'

const selectRowPropAfterClickRow = {
  selectedRankingId: ''
};

/**
 * Class handling the global ranking selection list
 *
 * User clicks on a ranking to display and use it
 *
 * @extends React.Component
 */

class GlobalRankings extends Component {

  //#region Constructor
  constructor(props){
    super(props);
    this.state = {
      data:''
    }
    this.tablesortoptions = {
     defaultSortName: 'RANKINGNAME',  // default sort column name
     defaultSortOrder: 'asc'  // default sort order
   };
   console.log('in GlobalRankings')
  }
  //#endregion


  //REVIEW: change name to onClickRankingJoinSelected?
  onClickRankingSelected(cell, row, rowIndex){
    selectRowPropAfterClickRow.selectedRankingId = `${row['RANKINGID']}`;
    console.log('selectRowPropAfterClickRow.selectedRankingId', selectRowPropAfterClickRow.selectedRankingId)
    newrankIdCB(selectRowPropAfterClickRow.selectedRankingId);
    viewingOnlyCB(false);
    this.props.onAfterUserUpdate();
    this.props.history.push('/home/@' + this.props.user.username);
    //this.openResultModal();
   }

   onClickRankingViewSelected(cell, row, rowIndex){
     //console.log('Product #', rowIndex);
     selectRowPropAfterClickRow.selectedRankingId = `${row['RANKINGID']}`;
     console.log('selectRowPropAfterClickRow.selectedRankingId', selectRowPropAfterClickRow.selectedRankingId)
     newrankIdCB(selectRowPropAfterClickRow.selectedRankingId);
     viewingOnlyCB(true);
     this.props.onAfterUserUpdate();
     this.props.history.push('/home/@' + this.props.user.username);
     //this.openResultModal();
    }

  rankingButton(cell, row, enumObject, rowIndex) {
      return (
         <button
            bsstyle="primary"
            //type="button"
            onClick={() =>
            this.onClickRankingSelected(cell, row, rowIndex)}
         >
         Join
         </button>
      )
   }

   rankingViewButton(cell, row, enumObject, rowIndex) {
       return (
          <button
             bsstyle="primary"
             //type="button"
             onClick={() =>
             this.onClickRankingViewSelected(cell, row, rowIndex)}
          >
          View
          </button>
       )
    }

//#region React lifecycle events
//QUESTION: why does componentDidMount not have the data from this.props.rankingJSONdata
//when it clearly gets passed to Home.js?
  componentDidMount() {
    // console.log(this.props.rankingJSONdata);
    //let currentUserRank = await JSONops._getUserRank(this.props.rankingJSONdata, this.props.user[1]);
    // let currentUserRank =  JSONops._getUserValue(this.props.rankingJSONdata, this.props.user[1], "RANK");
    // //JSONops._getUserValue(this.state.data, this.state.user.username, "RANK"),
    //  console.log(currentUserRank);
    // this.setState({ rank: currentUserRank });
  }

  globalBSTableDisplay(){
      //if (this.props.rankingJSONdata[0] === null && this.props.user.username === null){
      // if (JSONops.isJSONEmpty(this.props.rankingJSONdata) && this.props.user.username === null){
      //
      console.log('inside globalBSTableDisplay');
      //   this.props.history.push('/create');
      //   return null;
      //   //(<div>No Data To Display - Please select an account (top right) to create a player</div>);
      // } else {
      return (
        <BootstrapTable  options={ this.tablesortoptions } data={this.props.rankingListJSONdata}
        >
              <TableHeaderColumn isKey dataField='RANKINGID'
              hidden >
                RANKINGID
              </TableHeaderColumn>

              <TableHeaderColumn  dataField='RANKINGNAME'
              filter={ { type: 'TextFilter', defaultValue: '' } }
              >
                Ranking Name (Filter)
              </TableHeaderColumn>

              <TableHeaderColumn dataField='RANKINGDESC'
              filter={ { type: 'TextFilter',  defaultValue: '' } }
              >
               Ranking Description (Filter)
              </TableHeaderColumn>

              <TableHeaderColumn
              dataField='button'
              dataFormat={this.rankingViewButton.bind(this)}
            >
              View
              </TableHeaderColumn>

              <TableHeaderColumn
              dataField='button'
              dataFormat={this.rankingButton.bind(this)}
            >
              Join
              </TableHeaderColumn>

              <TableHeaderColumn dataField='ACTIVE'
              filter={ { type: 'TextFilter', defaultValue: 'true' } }
              hidden>
                Active?
              </TableHeaderColumn>

            </BootstrapTable>
          )
        }


  //REVIEW: Home page may be unnecessarily re-rendering with this approach to passing props
  //but need to pass the username and display it as a greeting and to link account with json data
  //this.props.user[1] is a quick way (not object.keys) to access the array
  render () {
      console.log('b4 render globalBSTableDisplay with rankingListJSONdata', this.props.rankingListJSONdata)
    return (
      <div>
      <Grid>
        <Row>
          {this.globalBSTableDisplay()}
        </Row>
      </Grid>
      </div>
    )
  }
  //#endregion
}

export default GlobalRankings
