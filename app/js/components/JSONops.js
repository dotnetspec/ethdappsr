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
      //console.log(responseJson);
  return responseJson
    })
    .catch((error) => {
      console.error(error);
    });
  },

  _getUserValue: function(jsonObj, currentUser, valueToLookup){

    console.log(jsonObj)
    console.log(currentUser)

    let lookupCurrentUserValue = {
      jsonRS: jsonObj,
      lookupField: 'NAME',
      lookupKey: currentUser,
      targetField: valueToLookup,
      //targetData: "",
      checkAllRows: false
      };
      //console.log(lookupCurrentUserRank)
      const currentUserValue = this._getVal(lookupCurrentUserValue);

        return currentUserValue;
  },

  _setUserValue: function(jsonObj, userOrOppoName, valueToSet, newValue){

    console.log(valueToSet)
    console.log(newValue)

    let setNewUserValue = {
      jsonRS: jsonObj,
      lookupField: 'NAME',
      lookupKey: userOrOppoName,
      targetField: valueToSet,
      targetData: newValue,
      checkAllRows: false
      };
      const newUserValue = this._setVal(setNewUserValue);

      return newUserValue;
  },

    //re-set user and opponent fields now that a result needs to be processed
    _updateEnterResultJSON: function(currentUser, currentUserRank, selectedOpponent, selectedOpponentRank, data){

      //create an updatedUserJSON object to update the User in the Json
      let updatedUserJSON = this._setUserValue(data, currentUser, "RANK", selectedOpponentRank);
      //and add result to the updatedUserJSON object
      updatedUserJSON = this._setUserValue(data, currentUser, "CURRENTCHALLENGERID", 0);
      updatedUserJSON = this._setUserValue(data, currentUser, "CURRENTCHALLENGERNAME", "AVAILABLE");
      updatedUserJSON = this._setUserValue(data, selectedOpponent, "RANK", currentUserRank);
      updatedUserJSON = this._setUserValue(data, selectedOpponent, "CURRENTCHALLENGERNAME", "AVAILABLE");
      //send after all the updates have been made
      //to the updatedUserJSON object
      this._sendJSONData(updatedUserJSON);
    },

    _updateEnterResultUndecidedJSON: function(currentUser, selectedOpponent, data){
        //set both player to AVAILABLE
        let updatedUserJSON = this._setUserValue(data, currentUser, "CURRENTCHALLENGERNAME", "AVAILABLE");
        updatedUserJSON = this._setUserValue(data, selectedOpponent, "CURRENTCHALLENGERNAME", "AVAILABLE");

        this._sendJSONData(updatedUserJSON);
    },

    _updateDoChallengeJSON: function(currentUser, selectedOpponent, data){
      //get the user's id number
      const userIDNumber = this._getUserValue(data, currentUser, "id");
      //NB: selectedOpponentIDNumber not currently used but possible it may be needed
      //const selectedOpponentIDNumber = this._getUserValue(data, selectedOpponent, "id");

      let updatedUserJSON = this._setUserValue(data, selectedOpponent, "CURRENTCHALLENGERID", userIDNumber);

      updatedUserJSON = this._setUserValue(data, selectedOpponent, "CURRENTCHALLENGERNAME", currentUser);

      this._sendJSONData(updatedUserJSON);
    },

      _getVal: function(jsonObj){
      for (var i = 0; i < jsonObj.jsonRS.length; i++) {
          if (jsonObj.jsonRS[i][jsonObj.lookupField] === jsonObj.lookupKey || jsonObj.lookupKey === '*') {
              return jsonObj.jsonRS[i][jsonObj.targetField];
          }
       }
    },

    createNewUserInJSON: function(originalData, username, accountno, description){

      let createNewJSONuserObj = {
        jsonRS: originalData
        };

        let nextIDandInitialRankObj = {
          jsonRS: originalData
          };

        nextIDandInitialRankObj.lookupField = "NAME";
        //TODO: this is 'currentuser' elasewhere
        nextIDandInitialRankObj.lookupKey = username;

        const nextIDandInitialRank = this.getNextID(nextIDandInitialRankObj.jsonRS);
        //console.log(nextIDandInitialRank);
        // const nickName = username.substring(0,5);
        //   console.log(nickName);

        //QUESTION: it appears the data needs to be sent in reverse order - why?
        const newData = {
                          "ACTIVE": true,
                          "DESCRIPTION": description,
                          "CURRENTCHALLENGERNAME": "AVAILABLE",
                          "CURRENTCHALLENGERID": 0,
                          "ACCOUNT": accountno,
                          "RANK": nextIDandInitialRank,
                          "NAME": username,
                          "id":nextIDandInitialRank
                        }
      //console.log('in createNewUserInJSON');
      //console.log(createNewJSONuserObj.jsonRS);
//TODO: ready to send to jsonbin
        createNewJSONuserObj.jsonRS.push(newData);
        // console.log('after the push');
        // console.log(createNewJSONuserObj.jsonRS);
        this._sendJSONData(createNewJSONuserObj.jsonRS);

    },

    reactivatePlayer: function(originalData, currentUser, accountno){

        let updateUserACTIVE = {
          jsonRS: originalData,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

          updateUserACTIVE.lookupField = "NAME";
          updateUserACTIVE.lookupKey = currentUser;
          updateUserACTIVE.targetField = "ACTIVE";
          updateUserACTIVE.targetData = true;

      //update json with all the updates within it before sending
      let updatedUserJSON = this._setVal(updateUserACTIVE);

      //update json with all the updates within it before sending
      //updatedUserJSON = this._setVal(updateUserACTIVE);

    //  console.log('updatedUserJSON on re-activate');
      //console.log(updatedUserJSON);

      this._sendJSONData(updatedUserJSON);
    },

    _setVal: function(update){

      //console.log('in setval');
      // console.log('inside setVal');
      // console.log(update);
          for (var i = 0; i < update.jsonRS.length; i++) {
            // console.log('in setval for loop');
            // console.log(typeof(update.jsonRS[i][update.lookupField]));
            // console.log(update.jsonRS[i][update.lookupField]);
            // console.log(typeof(update.lookupKey));
            // console.log(update.lookupKey);
            //REVIEW: what does update.lookupKey === '*' mean?
              if (update.jsonRS[i][update.lookupField] === update.lookupKey || update.lookupKey === '*') {
              //  console.log('here1');
                  update.jsonRS[i][update.targetField] = update.targetData;
                  // console.log(update.jsonRS[i][update.targetField]);
                  // console.log(update.jsonRS);
                  return update.jsonRS;
                  //if (!update.checkAllRows) { return; }
              }
          }

    },

    deactivatePlayer: function(originalData, currentUser, accountno){

        let updateUserACTIVE = {
          jsonRS: originalData,
          lookupField: "",
          lookupKey: 0,
          targetField: "",
          targetData: "",
          checkAllRows: false
          };

          updateUserACTIVE.lookupField = "NAME";
          updateUserACTIVE.lookupKey = currentUser;
          updateUserACTIVE.targetField = "ACTIVE";
          //key line
          updateUserACTIVE.targetData = false;


      let updatedUserJSON = this._setVal(updateUserACTIVE);

      //const currentUserRank = this._getUserRank(originalData, currentUser);
      const currentUserRank = this._getUserValue(originalData, currentUser, "RANK");

      //re-set targetfield and targetData set to 1
      updateUserACTIVE.lookupField = "RANK";
      updateUserACTIVE.targetField = "RANK";
      updateUserACTIVE.targetData = 1;


      //console.log('before shiftAllOtherPlayersRankingUpByOne');
      updatedUserJSON = this.shiftAllOtherPlayersRankingUpByOne(updateUserACTIVE, currentUserRank);

      updatedUserJSON = this._setVal(updateUserACTIVE);

      //set the user's rank to the bottom  as well
      //REVIEW: it's possible this (below) could be part of shiftAllOtherPlayersRankingUpByOne code
      //but currently is necessary here
      updateUserACTIVE.lookupField = "NAME";
      updateUserACTIVE.lookupKey = currentUser;
      updateUserACTIVE.targetField = "RANK";
      //the length of the data is the equivalent of the bottom rank
      //console.log(updateUserACTIVE.jsonRS.length);
      updateUserACTIVE.targetData = updateUserACTIVE.jsonRS.length;

      //update json with ALL the updates within it before sending
      updatedUserJSON = this._setVal(updateUserACTIVE);

      //only send after all the updates have been made
      //to the updatedUserJSON object

      //console.log(updatedUserJSON);

      this._sendJSONData(updatedUserJSON);

    },

  shiftAllOtherPlayersRankingUpByOne: function(update, currentUserRank){

      //console.log('in setval');
      // console.log('inside setVal');
      // console.log(update);

          let ranktobeupdated = 1;

          for (var i = 0; i < update.jsonRS.length; i++) {

            //console.log('in shiftAllOtherPlayersRankingUpByOne for loop');
            // console.log(typeof(update.targetData));
            // console.log(update.targetData);

            // console.log(typeof(update.jsonRS[i][update.lookupField]));
            // console.log('update.jsonRS[i][update.lookupField]');
            // console.log(update.jsonRS[i][update.lookupField]);
            // console.log(typeof(update.lookupKey));
            // console.log(update.lookupKey);

            //i += 1;
            ranktobeupdated = update.jsonRS[i][update.lookupField];

            // console.log('currentUserRank');
            // console.log(currentUserRank);
            //
            // console.log('ranktoeupdated');
            // console.log(ranktobeupdated);

            //make the change according to the current users relative position
            if(currentUserRank === update.jsonRS[i][update.lookupField]){
              //this is the current user's rank which must now be set to the last rank
            //  console.log('inside if 1');
              update.jsonRS[i][update.targetField] = update.jsonRS.length;

            }
            else if(currentUserRank < update.jsonRS[i][update.lookupField]){
              //console.log('inside if 2');
              //this counter manages the first player after the de-activated Player

              //let counter = 0;
              //if (counter === 0){
                //update.jsonRS[i][update.targetField] = ranktobeupdated;
              //} else {
              ranktobeupdated -= 1;
              update.jsonRS[i][update.targetField] = ranktobeupdated;
            }
            //bring nearest up to current users rank
            //probably never used
            // else if (currentUserRank === ranktobeupdated){
            //   console.log('inside if 3');
            //       update.jsonRS[i][update.targetField] = currentUserRank;
            //   }
          }
          return update.jsonRS;
    },

//NB:admin function - not used directly by app
//TODO: create a separate admin screen
    deletePlayer: function(originalData, currentUser, accountno){
      let deletePlayerJSONuserObj = {
        jsonRS: originalData,

        };

        deletePlayerJSONuserObj.lookupField = "NAME";
        deletePlayerJSONuserObj.lookupKey = currentUser;


        //console.log(deletePlayerJSONuserObj.jsonRS);
        //delete deletePlayerJSONuserObj.jsonRS[3];
        //console.log(deletePlayerJSONuserObj.jsonRS);

          for (var i = 0; i < deletePlayerJSONuserObj.jsonRS.length; i++) {
              if (deletePlayerJSONuserObj.jsonRS[i][deletePlayerJSONuserObj.lookupField] === deletePlayerJSONuserObj.lookupKey || deletePlayerJSONuserObj.lookupKey === '*') {
              //  console.log(deletePlayerJSONuserObj.jsonRS[i]);
                  delete deletePlayerJSONuserObj.jsonRS[i];
              }
          }
          deletePlayerJSONuserObj.jsonRS = deletePlayerJSONuserObj.jsonRS.filter(function(x) { return x !== null });
      return deletePlayerJSONuserObj.jsonRS;
    },

      //add 1 to existing length of json obj array to obtain a new id number
      getNextID: function(data){
        const add1toLengthtogetID = data.length + 1;
        return add1toLengthtogetID;
      },

      //same functionality as getNextID
      // getBottomRank: function(data){
      //   const add1toLengthtogetID = data.length + 1;
      //   return add1toLengthtogetID;
      // },

      //apart from IN/ACTIVE is player listed at all?
      isPlayerListedInJSON: function(data, currentUser){
        let isPlayerListedInJSONObj = {
          jsonRS: data
          };
          //used for return value below
          let isPlayerListed = false;
          isPlayerListedInJSONObj.lookupField = "NAME";
          isPlayerListedInJSONObj.lookupKey = currentUser;

        //  console.log(isPlayerListedInJSONObj.jsonRS);

            for (var i = 0; i < isPlayerListedInJSONObj.jsonRS.length; i++) {
                if (isPlayerListedInJSONObj.jsonRS[i][isPlayerListedInJSONObj.lookupField] === isPlayerListedInJSONObj.lookupKey || isPlayerListedInJSONObj.lookupKey === '*') {
                  // console.log(isPlayerListedInJSONObj.jsonRS[i]);
                  //   delete isPlayerListedInJSONObj.jsonRS[i];
                  isPlayerListed = true;
                }
            }

            if (isPlayerListed === true){
              return true;
            }
            else {
              return false;
            }
            //isPlayerListedInJSONObj.jsonRS = isPlayerListedInJSONObj.jsonRS.filter(function(x) { return x !== null });
      },

      //TODO: will have to separate isPlayerAvailableToChallengeObj.jsonRS[i].CURRENTCHALLENGERNAME === user
      //out to new function at some point cos otherwise pos of double challenge v same Player
      //update: think this has been done in isPlayerAlreadyChallengingThisOpp
      isPlayerAvailableToChallenge: function(data, opponentName, user){
        let isPlayerAvailableToChallengeObj = {
          jsonRS: data
          };
          //used for return value below
          let isPlayerAvailable = false;
          isPlayerAvailableToChallengeObj.lookupField = "NAME";
          isPlayerAvailableToChallengeObj.lookupKey = opponentName;

          //console.log(isPlayerAvailableToChallengeObj.jsonRS);

            for (var i = 0; i < isPlayerAvailableToChallengeObj.jsonRS.length; i++) {
                if (isPlayerAvailableToChallengeObj.jsonRS[i][isPlayerAvailableToChallengeObj.lookupField] === isPlayerAvailableToChallengeObj.lookupKey || isPlayerAvailableToChallengeObj.lookupKey === '*') {
                  //   console.log('isPlayerAvailableToChallengeObj.jsonRS[i].CURRENTCHALLENGERNAME');
                  // console.log(isPlayerAvailableToChallengeObj.jsonRS[i].CURRENTCHALLENGERNAME);
                  if(isPlayerAvailableToChallengeObj.jsonRS[i].CURRENTCHALLENGERNAME === 'AVAILABLE'){
                //^ isPlayerAvailableToChallengeObj.jsonRS[i].CURRENTCHALLENGERNAME != user){
                    isPlayerAvailable = true;
                  }
                }
            }

            if (isPlayerAvailable === true){
              return true;
            }
            else {
              return false;
            }
      },
      isPlayerAvailableToEnterResultAgainst: function(data, opponentName, user){
        let isPlayerAvailableToEnterResultAgainstObj = {
          jsonRS: data
          };
          //used for return value below
          let isPlayerAvailableToEnterResultAgainst = true;
          isPlayerAvailableToEnterResultAgainstObj.lookupField = "NAME";
          isPlayerAvailableToEnterResultAgainstObj.lookupKey = opponentName;

          //console.log(isPlayerAvailableToEnterResultAgainstObj.jsonRS);

            for (var i = 0; i < isPlayerAvailableToEnterResultAgainstObj.jsonRS.length; i++) {
                if (isPlayerAvailableToEnterResultAgainstObj.jsonRS[i][isPlayerAvailableToEnterResultAgainstObj.lookupField] === isPlayerAvailableToEnterResultAgainstObj.lookupKey || isPlayerAvailableToEnterResultAgainstObj.lookupKey === '*') {
                  //   console.log('isPlayerAvailableToEnterResultAgainstObj.jsonRS[i].CURRENTCHALLENGERNAME');
                  // console.log(isPlayerAvailableToEnterResultAgainstObj.jsonRS[i].CURRENTCHALLENGERNAME);
                  if(isPlayerAvailableToEnterResultAgainstObj.jsonRS[i].CURRENTCHALLENGERNAME === 'AVAILABLE'){
                    isPlayerAvailableToEnterResultAgainst = false;
                  }
                }
            }

            if (isPlayerAvailableToEnterResultAgainst === true){
              return true;
            }
            else {
              return false;
            }
      },
      isPlayerAlreadyChallengingThisOpp: function(data, opponentName, user){
        let isPlayerAlreadyChallengingThisOppObj = {
          jsonRS: data
          };
          //used for return value below
          let isPlayerAlreadyChallengingThisOpp = false;
          isPlayerAlreadyChallengingThisOppObj.lookupField = "NAME";
          isPlayerAlreadyChallengingThisOppObj.lookupKey = opponentName;

          //console.log(isPlayerAlreadyChallengingThisOppObj.jsonRS);

            for (var i = 0; i < isPlayerAlreadyChallengingThisOppObj.jsonRS.length; i++) {
                if (isPlayerAlreadyChallengingThisOppObj.jsonRS[i][isPlayerAlreadyChallengingThisOppObj.lookupField] === isPlayerAlreadyChallengingThisOppObj.lookupKey || isPlayerAlreadyChallengingThisOppObj.lookupKey === '*') {
                  //   console.log('isPlayerAlreadyChallengingThisOppObj.jsonRS[i].CURRENTCHALLENGERNAME');
                  // console.log(isPlayerAlreadyChallengingThisOppObj.jsonRS[i].CURRENTCHALLENGERNAME);
                  if(isPlayerAlreadyChallengingThisOppObj.jsonRS[i].CURRENTCHALLENGERNAME === user){
                    isPlayerAlreadyChallengingThisOpp = true;
                  }
                }
            }

            if (isPlayerAlreadyChallengingThisOpp === true){
              return true;
            }
            else {
              return false;
            }
      },

    _sendJSONData: function(data){
      let req = new XMLHttpRequest();

          req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
              //console.log(req.responseText);
            }
          };

          //NOTE: it is the api.jsonbin NOT the jsonbin.io!
          //JSON data can and should be in ANY order
          //bin id is: https://jsonbin.io/5bd82af2baccb064c0bdc92a/
          //use above to edit manually.
          //to view latest https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a/latest

          req.open("PUT", "https://api.jsonbin.io/b/5bd82af2baccb064c0bdc92a", true);
          req.setRequestHeader("Content-type", "application/json");
          var myJsonString = JSON.stringify(data);
          //console.log(myJsonString);
          req.send(myJsonString);

  }
}

export default JSONops;
