//TODO: refactor
const JSONops = {

  _loadsetJSONData: function(){


    //NOTE: it is the api.jsonbin NOT the jsonbin.io!
    //JSON data can and should be in ANY order
    //bin id is: https://jsonbin.io/5bd82af2baccb064c0bdc92a/
    fetch('https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest')
    //TODO: get it working with ipfs/swarm
    //fetch('http://localhost:8080/ipfs/QmXthCeahQiqDecUWPYB8VJEXCn6YNpLv9xcAgt8hhUdE2/Rankings.json')
    .then((response) => response.json())
    .then((responseJson) => {
      // this.setState({
      //   //isLoading: false,
      //   data: responseJson,
      //
      // }

      //, function(){
  //console.log(responseJson);
      //});
      console.log(responseJson);
  return responseJson
    })
    .catch((error) => {
      console.error(error);
    });
  },

    _updateEnterResultJSON: function(currentUser, currentUserRank, selectedOpponent, selectedOpponentRank, data){

      let updateUserRank = {
        //jsonRS: this.props.data,
        jsonRS: data,
        lookupField: "",
        lookupKey: 0,
        targetField: "",
        targetData: "",
        checkAllRows: false
        };

        let updateUserCURRENTCHALLENGERID = {
          jsonRS: data,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

        let updateOpponent = {
          jsonRS: data,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

        console.log(selectedOpponentRank);
      console.log(typeof selectedOpponentRank);

      //update the User RANK field
      updateUserRank.lookupField = "NAME";
      updateUserRank.lookupKey = currentUser;
      updateUserRank.targetField = "RANK";
      //update the current user's rank to the selected opponent's rank
      updateUserRank.targetData = selectedOpponentRank;
      //re-set user's CURRENTCHALLENGERID to 0
      // updateUser.targetField = "CURRENTCHALLENGERID";
      // updateUser.targetData = 0;

      //create an updatedUserJSON object to update the User in the Json
      //_setVal each time you need to make a change
      let updatedUserJSON = this._setVal(updateUserRank);
      //let updatedUserJSON = JSONops._setVal(updateUserRank);
      console.log('updatedUserJSON');
      console.log(updatedUserJSON);

      //re-set User CURRENTCHALLENGERID field
      //and add result to the updatedUserJSON object
      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERID";
      //update the current user's rank to the selected opponent's rank
      updateUserCURRENTCHALLENGERID.targetData = 0;

      //add the new changes to the same updatedUserJSON object
      updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);
      //updatedUserJSON = JSONops._setVal(updateUserCURRENTCHALLENGERID);
      console.log('updatedUserJSON CURRENTCHALLENGERID');
      console.log(updatedUserJSON);

      //re-set the current user's CURRENTCHALLENGERNAME
      //TODO:change updateUserCURRENTCHALLENGERID to a better name
      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERNAME";
      //update the current user's rank to the selected opponent's rank
      updateUserCURRENTCHALLENGERID.targetData = "Available";
      updatedUserJSON = this._setVal(updateUserCURRENTCHALLENGERID);
      //updatedUserJSON = JSONops._setVal(updateUserCURRENTCHALLENGERID);

      //update the Opponent fields
     updateOpponent.lookupField = "NAME";
     updateOpponent.lookupKey = selectedOpponent;
     updateOpponent.targetField = "RANK";
     //update the opponent's rank to the user's rank
     updateOpponent.targetData = currentUserRank;

       updatedUserJSON = this._setVal(updateOpponent);
       //updatedUserJSON = JSONops._setVal(updateOpponent);

     console.log('updateOpponent');
      console.log(updateOpponent);
      //update again with the oppenent's CURRENTCHALLENGERNAME also changed
      //to the same updatedUserJSON object

      updateOpponent.lookupField = "NAME";
      updateOpponent.lookupKey = selectedOpponent;
      updateOpponent.targetField = "CURRENTCHALLENGERNAME";
      //update the opponent's rank to the user's rank
      updateOpponent.targetData = "Available";

      updatedUserJSON = this._setVal(updateOpponent);


      //updatedUserJSON = JSONops._setVal(updateOpponent);

      console.log('updatedUserJSON');
       console.log(updatedUserJSON);


      //only send after all the updates have been made
      //to the updatedUserJSON object
      this._sendJSONData(updatedUserJSON);

      //JSONops._sendJSONData(updatedUserJSON);

    },

    _updateDoChallengeJSON: function(currentUser, selectedOpponent, data){

    //_updateDoChallengeJSON(currentUser, selectedOpponent){

      //REVIEW: using currentUser as lookupKey. May link to id in future

      console.log(currentUser);
      console.log(selectedOpponent);

      //use update objects to manage the json data
      //values are just placeholders until they get updated


        let updateUserCURRENTCHALLENGERID = {
          jsonRS: data,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

          //TODO: change name to lookupandupdateOpponentID
        let lookupOpponentID = {
          jsonRS: data,
          lookupField: '',
          lookupKey: '',
          targetField: "CURRENTCHALLENGERID",
          targetData: "",
          checkAllRows: false
          };


          //get the opponent's ID number
          lookupOpponentID.lookupField = "NAME";
          lookupOpponentID.lookupKey = selectedOpponent;
          lookupOpponentID.targetField = "id";
          //update the current user's challengeID to the selected opponent's ID
          //lookupOpponentID.targetData = selectedOpponentIDNumber;

      //find selectedOpponent's ID
      const selectedOpponentIDNumber = this._getVal(lookupOpponentID);
      console.log(selectedOpponentIDNumber);
      console.log(typeof selectedOpponentIDNumber);

      //TODO: change name to lookupandupdateUserID
      //get the user's id number

      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "id";
      //find selectedOpponent's ID
      const userIDNumber = this._getVal(updateUserCURRENTCHALLENGERID);
  // console.log(userIDNumber);
  // console.log(typeof userIDNumber);
      //update the User CURRENTCHALLENGERID field with the opponenet's id number
      updateUserCURRENTCHALLENGERID.lookupField = "NAME";
      updateUserCURRENTCHALLENGERID.lookupKey = currentUser;
      updateUserCURRENTCHALLENGERID.targetField = "CURRENTCHALLENGERID";
      //update the current user's challengeID to the selected opponent's ID
      updateUserCURRENTCHALLENGERID.targetData = selectedOpponentIDNumber;
      //now do the update:
      updateUserCURRENTCHALLENGERID = this._setVal(updateUserCURRENTCHALLENGERID);

      // console.log('updateUserCURRENTCHALLENGERID');
      // console.log(updateUserCURRENTCHALLENGERID);
      //
      // console.log('userIDNumber');
      // console.log(userIDNumber);

      lookupOpponentID.lookupField = "NAME";
      lookupOpponentID.lookupKey = selectedOpponent;
      lookupOpponentID.targetField = "CURRENTCHALLENGERID";
      //update the opponent's challengeID to the user's ID
      lookupOpponentID.targetData = userIDNumber;

      //create a new obj with all the updates within it before sending
      let updatedUserJSON = this._setVal(lookupOpponentID);

      //update the CURRENTCHALLENGERNAME as well
      lookupOpponentID.lookupField = "NAME";
      lookupOpponentID.lookupKey = selectedOpponent;
      lookupOpponentID.targetField = "CURRENTCHALLENGERNAME";
      //update the opponent's CURRENTCHALLENGERNAME to the current user's name
      lookupOpponentID.targetData = currentUser;

      //update json with all the updates within it before sending
      updatedUserJSON = this._setVal(lookupOpponentID);


      //only send after all the updates have been made
      //to the updatedUserJSON object
      this._sendJSONData(updatedUserJSON);

      // reset current user CURRENTCHALLENGERID to 0
    },
      _getVal: function(jsonObj){
    //_getVal(jsonObj){
      for (var i = 0; i < jsonObj.jsonRS.length; i++) {
         console.log('in _getVal for loop');
        // console.log(typeof(jsonObj.jsonRS[i][jsonObj.lookupField]));
        // console.log(typeof(jsonObj.lookupKey));
        //REVIEW: what does update.lookupKey === '*' mean?
          if (jsonObj.jsonRS[i][jsonObj.lookupField] === jsonObj.lookupKey || jsonObj.lookupKey === '*') {
            // console.log('targetField');
            // console.log(jsonObj.jsonRS[i][jsonObj.targetField]);
              //jsonObj.jsonRS[i][jsonObj.targetField] = jsonObj.targetData;
              return jsonObj.jsonRS[i][jsonObj.targetField];
              //if (!update.checkAllRows) { return; }
          }
      }
    },

    _setVal: function(update){

      //console.log('in setval');
      console.log('inside setVal');
          for (var i = 0; i < update.jsonRS.length; i++) {
            // console.log('in setval for loop');
            // console.log(typeof(update.jsonRS[i][update.lookupField]));
            // console.log(typeof(update.lookupKey));
            //REVIEW: what does update.lookupKey === '*' mean?
              if (update.jsonRS[i][update.lookupField] === update.lookupKey || update.lookupKey === '*') {
                //console.log('here1');
                  update.jsonRS[i][update.targetField] = update.targetData;
                  // console.log(update.jsonRS[i][update.targetField]);
                  // console.log(update.jsonRS);
                  return update.jsonRS;
                  //if (!update.checkAllRows) { return; }
              }
          }

    },

    createNewUserInJSON: function(data){

      let createNewJSONuserObj = {
        jsonRS: data
        // lookupField: '',
        // lookupKey: '',
        // targetField: "CURRENTCHALLENGERID",
        // targetData: "",
        // checkAllRows: false
        };

        const newData = {
                           "id":5,
                           "NAME": "Joe Bloggs",
                           "RANK": "5",
                           "ACCOUNT": "0x67fdF7E950a2C78B186a5fE6c692bf6EA5994737",
                           "CURRENTCHALLENGERID": 0,
                           "CURRENTCHALLENGERNAME": "",
                           "NICKNAME": "JoeyB"
                        }

      console.log('in createNewUserInJSON');
      console.log(createNewJSONuserObj.jsonRS);

//TODO: ready to send to jsonbin
        createNewJSONuserObj.jsonRS.push(newData);

        console.log('after the push');
        console.log(createNewJSONuserObj.jsonRS);

          //for (var i = 0; i < update.jsonRS.length; i++) {
            // console.log('in setval for loop');
            // console.log(typeof(update.jsonRS[i][update.lookupField]));
            // console.log(typeof(update.lookupKey));
            //REVIEW: what does update.lookupKey === '*' mean?
              //if (update.jsonRS[i][update.lookupField] === update.lookupKey || update.lookupKey === '*') {
                //console.log('here1');
                  //update.jsonRS[i][update.targetField] = update.targetData;
                    // console.log(update.jsonRS[i][update.targetField]);
                    // console.log(update.jsonRS);
                    //return update.jsonRS;
                  //return "in createNewUserInJSON";
                  //if (!update.checkAllRows) { return; }
              //}
          //}

          //this._sendJSONData(createNewJSONuserObj);

    },

    _sendJSONData: function(data){
      let req = new XMLHttpRequest();

          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              console.log(req.responseText);
            }
          };

          //NOTE: it is the api.jsonbin NOT the jsonbin.io!
          //JSON data can and should be in ANY order
          //bin id is: https://jsonbin.io/5bd82af2baccb064c0bdc92a/

          req.open("PUT", "https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a", true);
          req.setRequestHeader("Content-type", "application/json");
          var myJsonString = JSON.stringify(data);
          //console.log(myJsonString);
          req.send(myJsonString);

  }
}

export default JSONops;
