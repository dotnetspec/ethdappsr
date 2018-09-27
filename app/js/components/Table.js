import React, { Component, BootstrapTable, TableHeaderColumn } from 'react';
import Rankjsondata from '../../json/Rankings.json'

class Table extends React.Component {
  render() {
    return (
      <BootstrapTable data={ Rankjsondata }>
        <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='NAME'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='RANK'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
export default Table;
