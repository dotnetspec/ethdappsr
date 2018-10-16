import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
import Home from './Home';
import Userchallenges from './Userchallenges';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import Error from './Error';
import React, { Component } from 'react';

/**
 * Class representing the area below the header.
 * The component rendering in this area is controlled by
 * a @external "BrowserRouter"
 *
 * @extends React.Component
 */



class Main extends Component {

  //#region Constructor
  constructor(props){
    super(props);
  }
  //#endregion

  //#region React lifecycle events
  render () {
//var allProfiles = this.props.items.map(function(Main){
// let userprops = this.props.user[1];
// console.log(userprops);
// const user = "Phil";
    return (
      <main>
        <Switch>
          <Route exact path='/' render={(props) => <Home user={this.props.user[1]} />}/>
          <PropsRoute path='/@:username' component={Userchallenges} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} {...this.props}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} {...this.props}/>
          <PropsRoute path='/whoopsie' component={Error} {...this.props}/>
        </Switch>
      </main>
    )
  }
  //#endregion
}

export default Main
