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
import CreateNewRanking from './CreateNewRanking';
import UserRankings from './UserRankings'
import GlobalRankings from './GlobalRankings'

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
      pathnameStr: '/'
    }
    //this.configPathname();
  }

configPathname(){
  //const {pathname} = this.props.location;
  console.log('pathname prop in main.js', this.props.location.pathname)
  if(pathname.includes("srhost")){
    this.setState({ pathnameStr: '/srhost/' });
  }

}

  //#endregion


  //#region React lifecycle events

//QUESTION: why does componentDidMount not have the data from this.props.rankingJSONdata
//when it clearly gets passed to Home.js?
  componentDidMount() {
    //console.log(this.props.rankingJSONdata);
    //let currentUserRank = await JSONops._getUserRank(this.props.rankingJSONdata, this.props.user[1]);
    // let currentUserRank =  JSONops._getUserValue(this.props.rankingJSONdata, this.props.user[1], "RANK");
    // //JSONops._getUserValue(this.state.data, this.state.user.username, "RANK"),
    //  console.log(currentUserRank);
    // this.setState({ rank: currentUserRank });
  }

  //REVIEW: Home page may be unnecessarily re-rendering with this approach to passing props
  //but need to pass the username and display it as a greeting and to link account with json data
  //this.props.user[1] is a quick way (not object.keys) to access the array
  render () {

    return (
      <main>
        <Switch>
          {/*
          REVIEW: The original for Home would be:
          <Route exact path='/' component={Home}  {...this.props} rank={this.props.rank} user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}
          updatedExtAcctBalCB={this.props.updatedExtAcctBalCB} />
          It doesn't work. Don't know why
          //NB: below changed to PropsRoute
          <Route exact path='/' component={Home}  {...this.props} />
          dev ipns: /ipns/Qme2qFgitekEX6GZMvhqKifkmn9ZTfnAxHSn5j9ByrhCGV/
          srhost/ - no longer used
          /sportrank/ for staging server - PropsRoute will auto select correct path
          */}

          <PropsRoute exact path='/sportrank/' component={GlobalRankings}  {...this.props} />
          <PropsRoute exact path='/'  component={GlobalRankings}  {...this.props} />
          <PropsRoute path='/home/@:username' component={Home}  {...this.props} />
          <PropsRoute path='/@:username' component={Userchallenges} {...this.props}/>
          <PropsRoute path='/create' component={CreateUser} {...this.props} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/update/@:username' component={UpdateUser} {...this.props} rankingJSONdata={this.props.rankingJSONdata}/>
          <PropsRoute path='/newranking/@:username' component={CreateNewRanking} {...this.props} rankingJSONdata={this.props.rankingJSONdata} rankingListJSONdata={this.props.rankingListJSONdata}/>
          <PropsRoute path='/userrankings/@:username' component={UserRankings} {...this.props} rankingJSONdata={this.props.rankingJSONdata}/>
          <PropsRoute path='/delete/@:username' component={DeactivatePlayer} {...this.props} user={this.props.user[1]} rankingJSONdata={this.props.rankingJSONdata}/>}/>
          <PropsRoute path='/whoopsie' component={Error} {...this.props}/>
        </Switch>
      </main>
    )
  }
  //#endregion
}

export default Main
