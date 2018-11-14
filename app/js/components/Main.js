import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
import Home from './Home';
import Userchallenges from './Userchallenges';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import DeletePlayer from './DeletePlayer';
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

  //REVIEW: Home page may be unnecessarily re-rendering with this approach to passing props
  //but need to pass the username and display it as a greeting and to link account with json data
  //this.props.user[1] is a quick way (not object.keys) to access the array
  render () {
    return (
      <main>
        <Switch>
          <Route exact path='/' render={(props) => <Home user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/@:username' component={Userchallenges} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} {...this.props} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} {...this.props}/>
          <PropsRoute path='/delete/@:username' component={DeletePlayer} {...this.props} user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/whoopsie' component={Error} {...this.props}/>
        </Switch>
      </main>
    )
  }
  //#endregion
}

export default Main
