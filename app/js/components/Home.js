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

class UserPlayerJsonData extends Component {

   render() {
      // details is all the object -> array data coming from the data prop sent from Home
        const { details } = this.props;
        //console.log(details.RANK);
      return (
        <div>
         {details.RANK}
         </div>
      );
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
    const { githubData } = this.props;

//console.log(githubData);
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
                Decentralised SportRank <small>Built using Embark by Status</small>
                <p></p>
                Hi {this._findUserInJson(this.props.user)}
                Your ranking is:
                {Object.keys(githubData).map(key => (
               <UserPlayerJsonData key={key} details={githubData[key]} />
            ))}
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
            <div>
              <BootstrapTable data={this.props.githubData}
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
