import { Switch, Route } from 'react-router-dom';
import PropsRoute from './PropsRoute';
import Home from './Home';
import Userchallenges from './Userchallenges';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import DeactivatePlayer from './DeactivatePlayer';
import Error from './Error';
import React, { Component } from 'react';
import JSONops from './JSONops'

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
    this.state = {
      //data: this.removeAllInactivePlayers()
      rank: 0
    }
    console.log(this.props.rankingJSONdata);
  }
  //#endregion

  //#region React lifecycle events

//REVIEW: Better somewhere else?
  // removeAllInactivePlayers(){
  //
  //   console.log('removeAllInactivePlayers');
  //   //return this.props.rankingJSONdata
  //   const activeData = JSONops.removeInactivePlayers(this.props.rankingJSONdata);
  //   this.setState({ data: activeData });
  // }

//QUESTION: why does componentDidMount not have the data from this.props.rankingJSONdata
//when it clearly gets passed to Home.js?
  // async componentDidMount() {
  //   // console.log(this.props.rankingJSONdata);
  //   let currentUserRank = await JSONops._getUserRank(this.props.rankingJSONdata, this.props.user[1]);
  //    console.log(currentUserRank);
  //   this.setState({ rank: currentUserRank });
  // }


  //REVIEW: Home page may be unnecessarily re-rendering with this approach to passing props
  //but need to pass the username and display it as a greeting and to link account with json data
  //this.props.user[1] is a quick way (not object.keys) to access the array
  render () {
      // console.log(this.props.rankingJSONdata);
      // let currentUserRank = JSONops._getUserRank(this.props.rankingJSONdata, this.props.user[1]);
      // console.log(currentUserRank);
      //  this.setState({ rank: currentUserRank });
    return (
      <main>
        <Switch>
          <Route exact path='/' render={(props) => <Home currentUserRank={this.state.rank} user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/@:username' component={Userchallenges} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} {...this.props} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} {...this.props}/>
          <PropsRoute path='/delete/@:username' component={DeactivatePlayer} {...this.props} user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/whoopsie' component={Error} {...this.props}/>
        </Switch>
      </main>
    )
  }
  //#endregion
}

export default Main
