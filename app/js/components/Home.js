import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Rankjsondata from '../../json/Rankings.json'

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */
class Home extends Component{

  //#region Constructor
  constructor(props){
    super(props);
    //this.state = {title: "the title",};
  }


  //#endregion

  //const title = "Philip Here";

  // changeTitle(title){
  //   this.setState({title});
  // }
  //
  // handleChange(e){
  //   const title = e.target.value;
  //   this.changeTitle(title);
  // }

  //#region React lifecycle events
  render() {

    const data = Rankjsondata;

    // [{
    //   name: 'Tanner Linsley',
    //   age: 26,
    //   friend: {
    //     name: 'Jason Maurer',
    //     age: 23,
    //   }
    // }]

    const columns = [{
      Header: 'Name',
      accessor: 'NAME' // String-based value accessors!
    }, {
      Header: 'Rank',
      accessor: 'RANK',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      id: 'id', // Required because our accessor is not a string
      Header: 'Id',
      accessor: d => d.id // Custom value accessors!
    }, {
      Header: props => <span>Rank</span>, // Custom header components!
      accessor: 'RANK'
    }]


    return (
      <div>
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>
              Decentralised SportRank <small>Built using Embark by Status</small>
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
          <ReactTable
                    data={data}
                    columns={columns}
        />

        </Col>
      </Row>
      </Grid>

      </div>
    );
  }
  //#endregion
}

export default Home
