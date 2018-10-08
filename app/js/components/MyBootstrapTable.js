import React, {Component} from 'react'
import { Modal, Button } from 'react-bootstrap'
import Dochallenge from './Dochallenge';
import {BootstrapTable, TableHeaderColumn}
        from 'react-bootstrap-table'
//import '../css/Table.css'
//import '../dist/react-bootstrap-table-all.min.css'
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

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
    //alert(`You just selected '${row['NAME']}'`);
    //console.log(`'${row['NAME']}'`);
    //var namestr = ${row['NAME']};
    selectRowProp.name = `${row['NAME']}`;
  }
}


class MyBootstrapTable extends Component {


  constructor(props) {
    super(props);

    //const data = getData();
    //const columns = getColumns(data);
    this.state = {
      showModal: false,
      selectedOpponentName: selectRowProp.name
      //data,
      //columns,
      //selection: [],
      //selectAll: false
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
          <Dochallenge selectedOpponentName={selectRowProp.name}
           onAfterchallenge={(e) => this._handleClose()}></Dochallenge>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => this._handleClose(e)}>Close</Button>
        </Modal.Footer>
      </Modal>
        <BootstrapTable data={this.props.data}
                        selectRow={selectRowProp}
        >
          <TableHeaderColumn isKey dataField='id'
          >
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
