//JRainville - make functions available globally
document.checkMyChallengeOpponent = checkMyChallengeOpponent;

//todo: break this function up so that the xml doc is available
//and ready to do all the manipulation functions

//drawintial html table
//update a field
//remove a PLAYER
//username/pword issues?
loadXML();

function loadXML(){
				var x,xmlhttp,xmlDoc
				var txt = "0";
				xmlhttp = new XMLHttpRequest();
				//xmlhttp.open("GET", "xml/individual_rankings_long.xml", false);
				xmlhttp.open("GET", "xml/individual_rankings.xml", false);
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
				document.getElementById("demo").innerHTML = table;
}

function checkMyChallengeOpponent(opponentID){

	alert(opponentID);
}
