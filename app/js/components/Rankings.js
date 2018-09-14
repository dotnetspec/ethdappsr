import React, { Component } from 'react';

/**
 * Class representing the home page rendering
 *
 * @extends React.Component
 */
class Rankings extends Component{

  //#region Constructor
  constructor(props){
    super(props);
  }
  //#endregion

    render() {
      return (
        <div>
      <p>Click on a player to challenge</p>
      <p id='showCD'></p>
      <table id="demo"></table>
      </div>

    )
    }
}
export default Rankings
