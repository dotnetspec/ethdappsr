import React, { Component } from 'react';
//import Xmldocops from './Xmldocops';
//JRainville - make functions available globally
document.checkMyChallengeOpponent = checkMyChallengeOpponent;


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
    //Xmldocops.loadXML(){};
}

var x,xmlhttp,xmlDoc;
var txt = "0";
var table = "";
var i = 0;
xmlhttp = new XMLHttpRequest();
//xmlhttp.open("GET", "xml/individual_rankings_long.xml", false);
xmlhttp.open("GET", "../xml/individual_rankings.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
x = xmlDoc.getElementsByTagName("PLAYER");
table="<tr><th>PLAYER</th><th>Rank</th></tr>";
for (i = 0; i <x.length; i++) {
  x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue = txt;
  table += "<tr onclick='checkMyChallengeOpponent(" + i + ")'><td>";
  table += x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
  table += "</td><td>";
  table +=  x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue;
  table += "</td><td>" +
   "<p><button type='button' onclick='checkMyChallengeOpponent(" + x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue + ")'>Challenge</button>" ;
  table += "</td></tr>";
}
//alert('here');
document.getElementById("demo").innerHTML = table;

function checkMyChallengeOpponent(opponentID){

        alert(opponentID);
      }
export default Rankings;
