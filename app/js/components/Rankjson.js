import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
import Home from './Home';
import Userchallenges from './Userchallenges';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import Error from './Error';
import React, { Component } from 'react';
import Rankjsondata from '../../json/Rankings.json'

/**
 * Class manipulating the ranking data in json format
 * The component rendering in this area is controlled by
 * a @external "BrowserRouter"
 *
 * @extends React.Component
 */
class Rankjson extends Component {

  //#region Constructor
  constructor(props){
    super(props);
  }
  //#endregion

  //#region React lifecycle events
  render () {

    //console.log(this.props);
    return (
    <div>
    {Rankjsondata.map((rankdetail, index)=>{
      return <div>
      <h1>{rankdetail.NAME}</h1>
      <p>{rankdetail.RANK}</p>
      </div>
    })}
    </div>
    )
  }
  //#endregion
}

export default Rankjson
