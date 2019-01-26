pragma solidity ^0.4.24;
import './SafeMath.sol';

/** @title MyBounty dApp */
contract MyBounty {                                             // Declaration of MyBounty contract

    constructor() public {
        owner = msg.sender;                                     // Sets the owner of contract on initial deployment
    }

    using SafeMath for uint256;                                 // SafeMath library prevents overflow when working with uint                     
    address owner;                                              // Specifies the owner address of the contract
    bool isStopped = false;                                     // Determins contracts emergency stopped state (circuit breaker)
    uint public bountyCount;                                    // Acs as index/key of struct mappings
    enum SubmissionStatus {Accepted, Rejected, PendingReview}   // Current status of a HunterSubmission.
    enum BountyState {Open, Closed}                             // Current state of a BountyItem.

    struct HunterSubmission {                                   // Declaration of HunterSubmission struct type
        address hunter;                                         // Address of a Bounty Hunter.
        string body;                                            // Solution body of text.
        SubmissionStatus status;                                // Current status of a HunterSubmission.
    }

    struct BountyItem {                                         // Declaration of BountyList struct type
        address bountyPoster;                                   // Address of a Bounty Poster.
        string title;                                           // Title of a BountyItem.
        string description;                                     // Description of a BountyItem.
        uint amount;                                            // Reward Amount for submitting an accepted HunterSubmission. 
        BountyState state;                                      // Current state of a BountyItem.
        uint submissionCount;                                   // Acts as index/key for A BountyItem.
        mapping (uint => HunterSubmission) submissions;         // Struct mapping which contains each HunterSubmission 
    }                                                           //      for a particular Bountyitem.

    mapping(uint => BountyItem) public BountyList;              // Declaration of BountyList storage. 

    event CreateBounty (
        uint bountyId, 
        address bountyPoster, 
        string title, 
        string description, 
        uint amount, 
        BountyState state, 
        uint submissionCount
    );

    event CreateSubmission (
        uint bountyId, 
        uint submissionId, 
        address hunter, 
        string body, 
        SubmissionStatus status
    );

    event AcceptSubmission (uint bountyId, uint submissionId);
    event RejectSubmission (uint bountyId, uint submissionId);
    event FetchBounty (uint bountyId);
    event FetchSubmission (uint bountyId, uint submissionId);
    event StopContract (bool isStopped);
    event ResumeContract (bool isStopped);
    
    modifier verifyBountyOwner (uint _bountyId) { 
        require (msg.sender == BountyList[_bountyId].bountyPoster); _; 
    }
    
    modifier verifyState (uint _bountyId) { 
        require (BountyList[_bountyId].state == BountyState.Open); _; 
    }

    modifier verifyBalance (uint _bountyId) { 
        require (msg.sender.balance > BountyList[_bountyId].amount); _; 
    }

    modifier verifyBountyExists (uint _bountyId) { 
        require (_bountyId <= bountyCount); _; 
    }

    modifier verifySubmissionExists (uint _bountyId, uint submissionId) { 
        require(_bountyId <= BountyList[_bountyId].submissionCount); _; 
    }
    
    modifier stoppedInEmergency {
        require(!isStopped); _;
    }

    // Check for authorization. msg.sender must be owner
    modifier onlyAuthorized {
        require (msg.sender == owner); _;
    }

    /** @dev                        Creates a new BountyItem to which users can submit HunterSubmission solutions.
    *   @param _title               Title of a new BountyItem.
    *   @param _description         Description of a new BountyItem.
    *   @param _bountyAmount        Bounty award amount for a new BountyItem.
    *   @return boolean             Returns true if function is executes successfully.
    */
    function createBounty(string _title, string _description, uint _bountyAmount) public payable stoppedInEmergency() returns (bool) {
        bountyCount++;
        var newBountyItem = BountyItem(msg.sender, _title, _description, _bountyAmount, BountyState.Open, 0);
        BountyList[bountyCount] = newBountyItem;
        emit CreateBounty(bountyCount, msg.sender, _title, _description, _bountyAmount, BountyState.Open, 0);
        return true;
    }
    
    /** @dev                        Creates and submits a HunterSubmission for a BountyItem to be reviewed by the Bounty Poster.
    *   @param _bountyId            ID/mapping key for a BountyItem.
    *   @param _body                HunterSubmission solution body of text.
    *   @return boolean             Returns true if function is executes successfully.
    */
    function createSubmission(uint _bountyId, string _body) public 
        verifyBountyExists(_bountyId) 
        stoppedInEmergency()
        returns (bool)
    {
        require (msg.sender != BountyList[_bountyId].bountyPoster); // Prevent Bounty Posters from submitting their own HunterSubmissions
        BountyList[_bountyId].submissionCount++;
        var newSubmission = HunterSubmission(msg.sender, _body, SubmissionStatus.PendingReview);
        BountyList[_bountyId].submissions[BountyList[_bountyId].submissionCount] = newSubmission;
        emit CreateSubmission(
            _bountyId, 
            BountyList[_bountyId].submissionCount, 
            msg.sender, 
            _body, 
            SubmissionStatus.PendingReview
        );
        return true;
    }

    /** @dev                        Fetches the details of a BountyItem.
    *   @return bountyPoster        Address of the BountyItem poster.
    *   @return title               Title of the BountyItem.
    *   @return description         Description of the BountyItem.
    *   @return amount              Bounty award amount of the BountyItem.
    *   @return state               Current state (BountyState type) of the BountyItem.
    *   @return submissionCount     Number of HunterSubmissions for the BountyItem.
    */
    function fetchBounty(uint _bountyId) public view 
        verifyBountyExists(_bountyId) 
        stoppedInEmergency()
        returns(
            address bountyPoster, 
            string title, 
            string description, 
            uint amount, 
            BountyState state, 
            uint submissionCount
        ) 
    {
        return (
            BountyList[_bountyId].bountyPoster,
            BountyList[_bountyId].title,
            BountyList[_bountyId].description,
            BountyList[_bountyId].amount,
            BountyList[_bountyId].state,
            BountyList[_bountyId].submissionCount
        );
    }

    /** @dev                        Fetches the details for a HunterSubmission solution of a BountyItem.
    *   @param  _bountyId           ID/mapping key for a BountyItem.
    *   @param  _submissionId       ID/mapping key for a HunterSubmission.
    *   @return bountyId            Returns ID/mapping key of the BountyItem.
    *   @return submissionId        Returns ID/mapping key of the HunterSubmission.
    *   @return hunter              Returns hunter address of the HunterSubmission.
    *   @return body                Returns body of text for the HunterSubmission.
    *   @return status              Returns current status (SubmissionStatus type) of the HunterSubmission.
    */
    function fetchSubmission(uint _bountyId, uint _submissionId) public view 
        verifyBountyExists(_bountyId)
        verifySubmissionExists(_bountyId, _submissionId) 
        stoppedInEmergency()
        returns(
            uint bountyId, 
            uint submissionId, 
            address hunter, 
            string body, 
            SubmissionStatus status
        ) 
    {
        return ( 
            _bountyId,
            _submissionId,
            BountyList[_bountyId].submissions[_submissionId].hunter, 
            BountyList[_bountyId].submissions[_submissionId].body, 
            BountyList[_bountyId].submissions[_submissionId].status
        );   
    }
    
    /** @dev                        Accepts a HunterSubmission and sets the BountyItem state to Closed.
    *   @param _bountyId            ID/mapping key for a BountyItem.
    *   @param _submissionId        ID/mapping key for a HunterSubmission.
    */
    function acceptSubmission(uint _bountyId, uint _submissionId) public payable 
        verifyState(_bountyId)      // Do no allow setting state on closed/paid bounties.
        verifyBalance(_bountyId)    // Ensure the bounty owner has enough funds to pay the bounty amount.
        verifyBountyOwner(_bountyId)// Ensure the bounty owner is only one that can call this function.
        stoppedInEmergency()
        returns (bool)
    { 
        BountyList[_bountyId].submissions[_submissionId].status = SubmissionStatus.Accepted;
        BountyList[_bountyId].state = BountyState.Closed;
        BountyList[_bountyId].submissions[_submissionId].hunter.transfer(BountyList[_bountyId].amount);
        emit AcceptSubmission(_bountyId, _submissionId);
        return true;
    }
    
    /** @dev                        Rejects a HunterSubmission.
    *   @param _bountyId            ID/mapping key for a BountyItem.
    *   @param _submissionId        ID/mapping key for a HunterSubmission.
    *   @return boolean             Returns true if function is executes successfully.
    */
    function rejectSubmission(uint _bountyId, uint _submissionId) public 
        verifyBountyOwner(_bountyId) 
        verifyState(_bountyId) 
        stoppedInEmergency()
        returns (bool)
    {
        BountyList[_bountyId].submissions[_submissionId].status = SubmissionStatus.Rejected;
        emit RejectSubmission(_bountyId, _submissionId);
        return true;
    }

    /** @dev                        Enables contract emergency stop / circuit breaker. Only callable by contract owner. 
    *   @return isStopped           Returns boolean value of isStopped if stopContract executes successfully.
    */
    function stopContract() public onlyAuthorized() returns (bool) {
        isStopped = true;
        emit StopContract(isStopped);
        return isStopped;
    }

    /** @dev                        Enables contract emergency stop / circuit breaker. Only callable by contract owner. 
    *   @return isStopped           Returns boolean value of isStopped when contract owner providing the ownner status.
    */
    function checkStopContract() public onlyAuthorized() view returns (bool) {
        return isStopped;
    }

    /** @dev                        Disables contract emergency stop / circuit breaker. Only callable by contract owner.
    *   @return isStopped           Returns boolean value of isStopped if resumeContract executes successfully.
    */
    function resumeContract() public onlyAuthorized() returns (bool) {
        isStopped = false;
        emit ResumeContract(isStopped);
        return isStopped;
    }

    /// @dev                        Fallback function, which accepts ether when sent to contract.
    function() public payable {}
    
}