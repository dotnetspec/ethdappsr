import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import SelectTable from './SelectTable'
import Dochallenge from './Dochallenge';
import { NavLink, withRouter } from 'react-router-dom'
import testData from "../../json/Rankings.json";

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */

 //get data from JSON file
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




class Home extends Component{

  //#region Constructor
  constructor(props, context){
    super(props, context);

    const data = getData();
    this.state = {
      data
    };

  }

  //#endregion

  getUserNameFromAccount(accountNo){
    //get data from JSON file
    var playerName = "No name/account match";
    //map data and retreive corresponding name
    this.state.data.map((data) =>{
      if(data.ACCOUNT === accountNo){
        playerName = data.NAME;
      }
        else{
        console.log("No name/account match");
        }
   })
    return playerName;
  }

  //#region React lifecycle events
  render() {
//determine userName from account no. stored in JSON
//with this.getUserNameFromAccount(userName)
    const userAccountNo = web3.eth.defaultAccount;
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>
                Decentralised SportRank <small>Built using Embark by Status</small>
                <p>Hi {this.getUserNameFromAccount(userAccountNo)} - Click On The Opponent You Want To Challenge</p>
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
            <SelectTable />
          </Col>
        </Row>
        </Grid>
      </div>
    );
  }
  //#endregion
}

export default Home
