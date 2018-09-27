import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import Rankings from './Rankings';
import Rankjson from './Rankjson';

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
      </Grid>
      <Rankjson />

      </div>
    );
  }
  //#endregion
}

export default Home
