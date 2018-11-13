const JSONops = {
    _updateJSON: function(currentUser, currentUserRank, selectedOpponent, selectedOpponentRank, data){

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
