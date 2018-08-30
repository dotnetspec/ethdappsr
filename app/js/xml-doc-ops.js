// function loadXMLDoc() {
//
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       myFunction(this);
//     }
//   };
//   xmlhttp.open("GET", "xml/individual_rankings.xml", true);
//   xmlhttp.send();
// }
// function myFunction(xml) {
//
//   var i;
//   var xmlDoc = xml.responseXML;
//   var table="<tr><th>Player</th><th>Rank</th></tr>";
//   var x = xmlDoc.getElementsByTagName("PROFILE");
//   for (i = 0; i <x.length; i++) {
//     table += "<tr><td>" +
//     x[i].getElementsByTagName("PLAYER")[0].childNodes[0].nodeValue +
//     "</td><td>" +
//     x[i].getElementsByTagName("RANK")[0].childNodes[0].nodeValue +
//     "</td></tr>";
//   }
//   document.getElementById("demo").innerHTML = table;
// }

function checkMyChallengeOpponent(opponentID){
	alert(opponentID);
}

document.checkMyChallengeOpponent = checkMyChallengeOpponent;
