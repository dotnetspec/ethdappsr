import React, { Component } from 'react';
import { Grid, Row, Col, PageHeader, Button, Image, Modal, Navbar, ButtonToolbar, Dropdown, Glyphicon, MenuItem, Overlay, Tooltip } from 'react-bootstrap';
import SelectTable from './SelectTable'
import { NavLink, withRouter } from 'react-router-dom'
import testData from "../../json/Rankings.json";
import Spinner from 'react-spinkit';
import MyBootstrapTable from './MyBootstrapTable'

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

//   var data2 = [
//   {id: 1, name: 'Gob', value: '2'},
//   {id: 2, name: 'Buster', value: '5'},
//   {id: 3, name: 'George Michael', value: '4'}
// ];

var data2 = getData();


class Home extends Component{

  //#region Constructor
  constructor(props, context){
    super(props, context);
    //console.log(props);
    const data = getData();
    this.state = {
      showModal: false,
      data
    };

  }

  //#endregion


  getUserNameFromAccount(accountNo){

    var playerName = "No name/account match";
    //get data from JSON file
    //map data and retreive corresponding name
    this.state.data.map((data) =>{
      if(data.ACCOUNT === accountNo){
        playerName = data.NAME;
      }
        else{
        //console.log("No name/account match");
        }
   })
    return playerName;
  }

  //#region React lifecycle events
  render() {
      //const userAccountNo = web3.eth.defaultAccount;
      //
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
             <MyBootstrapTable data={data2}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  //#endregion
}

export default Home
