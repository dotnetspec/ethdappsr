import React, { Component } from 'react';
//JRainville - make functions available globally
document.checkMyChallengeOpponent = checkMyChallengeOpponent;

/**
 * Class representing the Xml table of players rendering
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
      var x,xmlhttp,xmlDoc;
      var txt = "0";
      var i = 0;
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", "../xml/individual_rankings.xml", false);
      xmlhttp.send();
      xmlDoc = xmlhttp.responseXML;
      x = xmlDoc.getElementsByTagName("PLAYER");
      var table="<table id='demo' align='center' width='800'><tr><th>PLAYER</th><th>RANK</th></tr>";
      for (i = 0; i <x.length; i++) {
        table += "<tr><td>";
        table += x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
        table += "</td><td>";
        table +=  x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue;
        table += "</td><td>" +
         "<p><button type='button' onclick='checkMyChallengeOpponent(" + x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue + ")'>Challenge</button>" ;
        table += "</td></tr>";
      }
      table += "</table>";
      return (
        <div>
          <p>Click on a player to challenge</p>
          <div className="content" dangerouslySetInnerHTML={{__html:table}}></div>
        </div>
    )
    }
}
function checkMyChallengeOpponent(opponentID){
        alert(opponentID);
      }

export default Rankings;
