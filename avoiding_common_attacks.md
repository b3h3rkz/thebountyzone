#### Measures taken to protect against common attacks

- This project uses an Ownable contract with an emergency stop feature allowing the contract owner to pause function execution. This can be disabled at any point by the contract owner.

- EthPM library SafeMath was used in this project to protect uint values from Integer Overflow and Underflow. This library is imported from OpenZeppelin.

- In the function acceptSubmission, the transfer of funds is the last sequential execution to mitigate reentrancy attacks.

- No calling of external contracts occcurs in this project. This increases the security as no other controact takes over control flow. 

- This project has a default payable function to accept erroneous payments made to contract without calling a function:

```function() public payable {}```

- All data is public allowing open access.
 
- Transactions are sent using msg.sender rather than tx.origin to reduce risk.

- Unit Tests were used to ensure the dApp works as expected.




