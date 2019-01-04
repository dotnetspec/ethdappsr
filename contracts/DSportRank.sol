pragma solidity ^0.4.24;

contract DSportRank{
    /**
     * User
     *
     * Struct holding the profile deatils of the user.
     */
    struct User {
        uint creationDate;      // date user was created
        string username;        // username of the user
        string description;     // user profile description
        address owner;          // address of the account who created the user
        string picture;         // IFPS hash of the user's profile picture
        string rankingDefault;
        string[] challenges;    // array that holds the user's challenges
        string[] rankings;      //array that holds the user's rankings ids(possibly names as well tbc)
    }
    /**
     * users
     *
     * Maps the keccak256 hash of a username to the deatils of the user
     *
     * {bytes32} [KEY] the keccak256 hash of the username
     * {User} the User struct containing the deatils of the user
     */
    mapping (bytes32 => User) public users;
    /**
     * owners
     *
     * Maps the address of the owner account to the username hash of the
     * owned user. This is needed so we can retrieve an account from the
     * current address
     *
     * {address} [KEY] the address of the owner who owns the user
     * {bytes32} the keccak256 hash of the username
     */
    mapping (address => bytes32) public owners;
    /**
     * Newchallenge
     *
     * Event to be emitted once a challenge is stored in the contract
     * {bytes32} _from - keccak256-hashed username of user who posted the challenge.
     *                          This field is indexed so it can be filtered.
     * {string} challenge - the challenge contents
     */
    event Newchallenge(
        bytes32 indexed _from,
        string challenge,
        uint time
    );

    /**
     * Newranking
     *
     * Event to be emitted once a new ranking list is stored in the contract
     * {bytes32} _from - keccak256-hashed username of user who posted the ranking.
     *                          This field is indexed so it can be filtered.
     * {string} ranking - the ranking contents
     */
    event Newranking(
        bytes32 indexed _from,
        string ranking,
        uint time
    );

    /**
     * getRankingAt
     *
     * Gets the user's rankig at the specified index
     *
     * (msg.sender) and the keccak256-hash of the username
     * {string} username - the username of the user
     * {string} description - the user profile description
     */

    function getRankingAt(uint index) public view returns (string)  {
      // ensure the sender has an account
      require(owners[msg.sender].length > 0);

      // get the username hash of the sender's account
      bytes32 usernameHash = owners[msg.sender];

      // get our user
      User storage user = users[usernameHash];

      // return the ranking at the ranking index
      return user.rankings[index];
 }

    /**
     * createAccount
     *
     * Creates a user account, storing the user (and user details) in the contract.
     * Additionally, a mapping is created between the owner who created the user
     * (msg.sender) and the keccak256-hash of the username
     * {string} username - the username of the user
     * {string} description - the user profile description
     */
    function createAccount(string username, string description, string rankingDefault) public {
        // ensure a null or empty string wasn't passed in
        require(bytes(username).length > 0);
        // generate the username hash using keccak
        bytes32 usernameHash = keccak256(abi.encodePacked(username));
        // reject if username already registered
        require(users[usernameHash].creationDate == 0);
        // reject if sending adddress already created a user
        require(owners[msg.sender] == 0);
        // add a user to the users mapping and populate details
        // (creationDate, owner, username, description)
        users[usernameHash].creationDate = now;
        users[usernameHash].owner = msg.sender;
        users[usernameHash].username = username;
        users[usernameHash].description = description;
        users[usernameHash].rankingDefault = rankingDefault;
        // add entry to our owners mapping so we can retrieve
        // user by their address
        owners[msg.sender] = usernameHash;
    }

    /**
     * editAccount
     *
     * Edits the deteails of a user's profile.
     * {bytes32} usernameHash - the keccak256-hashed username of the user to edit
     * {string} description (optional) - the updated user profile description
     * {string} rankingDefault (optional) - a new default ranking jsonbin.io id
     * {string} pictureHash (optional) - the IFPS hash of the user's updated profile picture
     */
    function editAccount(bytes32 usernameHash, string description, string rankingDefault, string pictureHash) public {
        // ensure the user exists and that the creator of the user is the
        // sender of the transaction
        require(users[usernameHash].owner == msg.sender);
        // update the description (could be empty)
        users[usernameHash].description = description;
        // only update the user's rankingDefault if a value is passed in
        if (bytes(rankingDefault).length > 0) {
        users[usernameHash].rankingDefault = rankingDefault;
        }
        // only update the user's picture if the hash passed in is
        // not empty or null (essentially disallows deletions)
        if (bytes(pictureHash).length > 0) {
          users[usernameHash].picture = pictureHash;
        }
    }
    /**
     * userExists
     *
     * Validates whether or not a user has an account in the user mapping
     * {bytes32} usernameHash - the keccak256-hashed username of the user to validate
     * {bool} - returns true if the hashed username exists in the user mapping, false otherwise
     */
    function userExists(bytes32 usernameHash) public view returns (bool) {
        // must check a property... bc solidity!
            return users[usernameHash].creationDate != 0;
    }
    /**
     * challenge
     *
     * Adds a challenge to the user's challenges and emits an event notifying listeners
     * that a challenge happened. Assumes the user sending the transaction is the challengeer.
     * {string} content - the challenge content
     */
    function challenge(string content) public {
        // ensure the sender has an account
        require(owners[msg.sender].length > 0);

        // get the username hash of the sender's account
        bytes32 usernameHash = owners[msg.sender];

        // get our user
        User storage user = users[usernameHash];

        // get our new challenge index
        uint challengeIndex = user.challenges.length++;

        // update the user's challenges at the challenge index
        user.challenges[challengeIndex] = content;

        // emit the challenge event and notify the listeners
        emit Newchallenge(usernameHash, content, now);
    }
    /**
     * Ranking list
     *
     * Adds a new ranking to the user's ranking list. Assumes the user sends the transaction.
     * {string} content array - the ranking list content rankname and id
     */
    function ranking(string content) public {
        // ensure the sender has an account
        require(owners[msg.sender].length > 0);

        // get the username hash of the sender's account
        bytes32 usernameHash = owners[msg.sender];

        // get our user
        User storage user = users[usernameHash];

        // get our new ranking index
        uint rankingIndex = user.rankings.length++;

        // update the user's rankings at the ranking index
        user.rankings[rankingIndex] = content;

        // emit the challenge event and notify the listeners
        emit Newranking(usernameHash, content, now);
    }
}
