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


//REVIEW: selectRowPropAfterClickRow had to be created separately from selectRowProp to handle the row data
//after selecting a row
const selectRowPropAfterClickRow = {
  selectedOpponentName: '',
  selected: [],
  selectedOpponentRank: ''
};


//REVIEW: Possibly unnecessary re-rendering
class UserPlayerJsonData extends Component {
   render() {
      // details is all the object -> array data coming from the data prop sent from Home
      //using the object.keys code
        const { details } = this.props;
        //console.log(details.RANK);
          if (details.NAME === this.props.username && details.ACTIVE === true)
            {
                //console.log(details.RANK);
              currentUserRank = details.RANK;

              return (
                <div>
                  Your current ranking is: {details.RANK}
               </div>);
             }else if (details.NAME === this.props.username && details.ACTIVE === false){
                 //this.setState({ activateText: 'Your account currently has no player associated with it' });
                //this.props.history.push('/update/@' + this.props.username);
               return (
                 <div>
                   Your player is currently deactivated!<p></p>
                   Click Update Profile (top  menu) to re-enter the rankings (at the bottom)
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
      //activateText: ''
    }
    this.tablesortoptions = {
     defaultSortName: 'RANK',  // default sort column name
     defaultSortOrder: 'asc'  // default sort order
   };
   //REVIEW: not sure about comment below...
   //_handleClose must be bound if it's going to be used in child components (it is)
   //this._handleClose = this._handleClose.bind(this);
  }
  //#endregion


//onSelectRow must be a component function of Home so that it is possible to toggle the modal
  onSelectRow(row, isSelected, e) {
       if (isSelected) {
          selectRowPropAfterClickRow.selectedOpponentName = `${row['NAME']}`;
          selectRowPropAfterClickRow.selectedOpponentRank = `${row['RANK']}`;
          this._handleShow();
       }
     }

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
    //TODO: make current user unselectable
    if(selectRowPropAfterClickRow.selectedOpponentName === this.props.user){
      this.setState({ warningText: ' You cannot challenge yourself!' });
    }else if(!JSONops.isPlayerAvailableToChallenge(this.props.rankingJSONdata, selectRowPropAfterClickRow.selectedOpponentName)){
        this.setState({ warningText: ' This player is currently being challenged by another player!' });
    }
    else{
      this.setState({ showModal: true });
      this.setState({ warningText: '' });
      }
}
// TODO: Challenge/Enter button should be part of onrowselect, not a separate button
//REVIEW: selectRowProp has to be defined in render for the onSelect to be bound to the
//onSelectRow function within this component. This is not fully understood and needs to be
//better understood
//https://github.com/AllenFang/react-bootstrap-table/issues/1035
  render() {
    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      unselectable: [0],
      selected: [],
      onSelect: this.onSelectRow.bind(this),
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
              Or enter the result from your last ladder match with {selectRowPropAfterClickRow.selectedOpponentName}:
          <EnterResult
          data={this.props.rankingJSONdata}
          selectedOpponentRank={selectRowPropAfterClickRow.selectedOpponentRank}
          currentUserRank={currentUserRank}
          user={this.props.user}
          selectedOpponentName={selectRowPropAfterClickRow.selectedOpponentName}
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
                      Player Name
                    </TableHeaderColumn>
                    <TableHeaderColumn  dataField='RANK' dataSort
                    >
                      Rank
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='CURRENTCHALLENGERNAME'
                    >
                      Current Challenger
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='ACTIVE'
                    filter={ { type: 'TextFilter', defaultValue: 'true' } }
                    hidden
                    >
                      Active?
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
