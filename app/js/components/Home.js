import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import SelectTable from './SelectTable'

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */
class Home extends Component{

  //#region Constructor
  constructor(props){
    super(props);
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
            </PageHeader>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
          <SelectTable
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
