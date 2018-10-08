import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import { NavLink, withRouter } from 'react-router-dom'
import Spinner from 'react-spinkit';
import MyBootstrapTable from './MyBootstrapTable'

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */

 //get data from JSON file



class Home extends Component{

  //#region Constructor
  constructor(props, context){
    super(props, context);
    //console.log(props);
    //const data = getData();
    this.state = {
      showModal: false
    //  data
    };

  }

  //#endregion

  //#region React lifecycle events
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>
                Decentralised SportRank <small>Built using Embark by Status</small>
                <p></p>
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
             <MyBootstrapTable />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  //#endregion
}

export default Home
