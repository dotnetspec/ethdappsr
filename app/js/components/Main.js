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
  //REVIEW: Home page may be unnecessarily re-rendering with this approach to passing username prop
  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' render={(props) => <Home user={this.props.user[1]} data={this.props.data}/>}/>
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
