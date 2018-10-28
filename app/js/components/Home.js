import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { NavLink, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit';
import Chance from "chance"
import DoChallenge from './DoChallenge'


/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */

 const selectRowProp = {
   mode: 'radio',
   selectedOpponentName: '',
   clickToSelect: true,
   unselectable: [0],
   selected: [],
   onSelect: onSelectRow,
   bgColor: 'gold'
 };

 function onSelectRow(row, isSelected, e) {
      if (isSelected) {
        selectRowProp.selectedOpponentName = `${row['NAME']}`;
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
    {return (
        <div>
          {details.RANK}
       </div>);
     }else{return (null);}
   }
}


class Home extends Component{

  //#region Constructor
  constructor(props, context){
    super(props, context);
    this.state = {
      showModal: false
    }
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
    this.setState({ showModal: true });
  }

  //find the user entry in the json return id, name and Rank
  _findUserInJson(username){
    // Object.keys(PlayerData).map(key => (
    //     <Issue key={key} details={PlayerData[key]} />
    //   ))
    return username;
  }

  render() {
    return (
      <div>
      <Button bsStyle="primary" onClick={(e) => this._handleShow(e)}>
        Challenge Selected Opponent
      </Button>
      <p></p>
      <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        You challenged {selectRowProp.selectedOpponentName}
          <DoChallenge selectedOpponentName={selectRowProp.selectedOpponentName}
           onAfterchallenge={(e) => this._handleClose()}></DoChallenge>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => this._handleClose(e)}>Close</Button>
        </Modal.Footer>
      </Modal>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>
                {this.props.user}<p></p>
                Your current ranking is:
                {Object.keys(this.props.rankingJSONdata).map(key => (
               <UserPlayerJsonData key={key} details={this.props.rankingJSONdata[key]} username={this.props.user}/>
            ))}
            <small>Select an opponent to challenge</small>
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
            <div>
              <BootstrapTable data={this.props.rankingJSONdata}
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
                    <TableHeaderColumn dataField='RANK'
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
