import React from "react";
import { render } from "react-dom";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

import Chance from "chance";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import testData from "../../json/Rankings.json";

import { Modal, Button } from 'react-bootstrap';
import Dochallenge from './Dochallenge';

const CheckboxTable = checkboxHOC(ReactTable);

const chance = new Chance();

function getData() {
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

function getColumns(data) {
  const columns = [];
  const sample = data[0];
  Object.keys(sample).forEach(key => {
    if (key !== "_id") {
      columns.push({
        accessor: key,
        Header: key
      });
    }
  });
  return columns;
}





class SelectTable extends React.Component {
  constructor(props) {
    super(props);

    const data = getData();
    const columns = getColumns(data);
    this.state = {
      showModal: false,
      data,
      columns,
      selection: [],
      selectAll: false
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
    console.log();
    this.setState({ showModal: true });
  }




  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?

      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).

      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).

      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'.
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array

      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = key => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    //console.log("key", key);
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    console.log("selection:", this.state.selection);
    console.log("using ChallengeOpponent:", this.state.selection);
  };

  render() {
    const { toggleSelection, toggleAll, isSelected, logSelection } = this;
    const { data, columns, selectAll } = this.state;
    //just need to iterate through this data
    //console.log(data);
    //console.log(this.account)
      {this.logSelection};

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        // someone asked for an example of a background color change
        // here it is...
        //const selected = this.isSelected(r.original._id);
        //line above changed based on https://github.com/react-tools/react-table/issues/1023
        const selected = r ? this.isSelected(r.original._id) : false
  //alert(r.original.NAME);
  if(r.row.NAME != null){
  console.log(r.row.NAME);
}
        return {

          style: {
            backgroundColor: selected ? "lightgreen" : "inherit"
            // color: selected ? 'white' : 'inherit',
          }
        };
      }
    };
//console.log(this.state.selection);
    return (
      <div>
        <Button bsStyle="primary" onClick={(e) => this._handleShow(e)}>
          Challenge from modal
        </Button>
        <Modal show={this.state.showModal} onHide={(e) => this._handleClose(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Dochallenge selectedOpponentName={this.state.selection}
             onAfterchallenge={(e) => this._handleClose()}></Dochallenge>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => this._handleClose(e)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <CheckboxTable
          ref={r => (this.checkboxTable = r)}
          data={data}
          defaultPageSize={10}
          className="-striped -highlight"
          {...checkboxProps}
          columns={[
              {
                    Header: "Name",
                    accessor: "NAME"
              },
              {
                    Header: "Rank",
                    accessor: "RANK"
              },

          ]}

        />
      </div>
    );
  }
}

export default SelectTable;
