import React, {Component} from 'react'
import { Modal, Button } from 'react-bootstrap'
import Dochallenge from './Dochallenge';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import testData from "../../json/Rankings.json";
import Chance from "chance"

const selectRowProp = {
  mode: 'radio',
  name: '',
  clickToSelect: true,
  unselectable: [0],
  selected: [],
  onSelect: onSelectRow,
  bgColor: 'gold'
};

function onSelectRow(row, isSelected, e) {
  if (isSelected) {
    selectRowProp.name = `${row['NAME']}`;
  }
}

function getData(){
  const data = testData.map(item => {
    // using chancejs to generate guid
    // shortid is probably better but seems to have performance issues
    // on codesandbox.io
    const _id = chance.guid();
    return {
      _id,
      ...item
    };
  });
  return data;
}

class MyBootstrapTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: getData(),
      showModal: false
    };
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
    //console.log();
    this.setState({ showModal: true });
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
        You challenged {selectRowProp.name}
          <Dochallenge selectedOpponentName={selectRowProp.name} data={this.state.data}
           onAfterchallenge={(e) => this._handleClose()}></Dochallenge>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => this._handleClose(e)}>Close</Button>
        </Modal.Footer>
      </Modal>


    <BootstrapTable data={this.state.data}
                        selectRow={selectRowProp}
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
    )
  }
}

export default MyBootstrapTable
