# Bounty Board #

## Demo ##

This project is hosted with GitHub pages and can be found here https://jgoodz.github.io/thebountyzone/


## Deployed Environment ##

This dapp demo is on the Ropsten Test Net and requires metamask to interact with. Below are some Ropsten faucets to get ether:
•	https://faucet.metamask.io/
•	http://faucet.ropsten.be:3001
•	https://faucet.bitfwd.xyz/

Transactions generally take up to 30 seconds to appear due to the Ropsten Test Net block time. To submit a solution you must be using an account other than the Posters account. Once the next block is mined, the bounty lists will automatically update. 


## Info ## 

This truffle project is a basic bounty board dApp where Bounty Posters can post a problem allowing bounty hunters to submit solutions. The Bounty Poster can review each submission and either accept or reject those submissions. If a submission is accepted, the bounty Poster is then prompted to transfer the bounty reward amount to the Bounty Bunter before the submission is accepted and the Bounty status closed. If a submission is rejected, the bounty status remains open and bounty hunters can continue to submit solutions. 

You will notice because you (identified via your metamask address) posted bounties you are unable to submit solutions to it. To test submitting a solution, please switch to a new metamask account. You can then switch back to the first account to accept or reject submissions.

Each Bounty Post contains the following details:

- Bounty Poster Address
- Title
- Description
- Bounty Reward Amount
- Bounty State (Open/Closed)
- Submission Count
- Submissions: A nested list fo each Bounty Post containing the Solutions submitted by Bounty Hunters

Each submission (nested within Bounty Posts) contains the following details:
- Bounty Hunter Address
- Solution body text
- Submission Status (Accepted, Rejected or Pending Review)


### Local Setup - Getting Started With the local version using ganache-cli

#### ** Ensure you use the release/local-ganache branch otherwise you will be connecting to a test net ** ####

Wondering how to set it up? There are two methods for getting started with this repo. Using git clone or manually download and extract the project zip.


#### Familiar with Git?
Checkout this repo, install dependencies, then start up the project for review:

```
> git clone https://github.com/jgoodz/thebountyzone.git 
> cd thebountyzone
> npm install
> npm start
```


#### Not Familiar with Git?
Click [here](https://github.com/jgoodz/thebountyzone/archive/master.zip) then download the .zip file. Extract the contents of the zip file, then open your terminal, change to the project directory, and run:

```
> npm install
```


#### Start the development web server to serve the front end interface of the application
Once you have finished downloading the project dependancies (npm install), run the development web server:

```
> npm start
```


#### Run a local development blockchain 
Open a new terminal in the project directory and start the ganache-cli development blockchain on port 8545:

```
> ganache-cli
```

Once ganache-cli has started, copy the provided seed phrase into Meta Mask and ensure its connecting to the Private Network http://localhost:8545

Then, open a new terminal window and compile and migrate the contracts using the commands below. Note for reference, all contracts are located in the contracts directory inside the project folder.

```
> truffle compile
> truffle migrate
```

Once the contracts have been compled and migrated, its time to open the front end UI. If it did not open automatically when running 'npm start', you can enter the url http://localhost:3000 into your browser to interact with the project front end.


#### Using thebountyzone dApp

Because the thebountyzone dApp restricts functions depending if a user is a bounty poster or bounty hunter, you will need to use two Meta Mask accounts or two separate browsers running Meta Mask with different accounts from the same seed provided by ganache-cli. 

Recommended browsers:

Chrome - [Download here](https://www.google.ca/chrome/)

Brave - [Download here](https://brave.com/download/)

[You can also download Meta Mask here for each browser](https://metamask.io/)


#### Example walkthrough of thebountyzone dApp:

Once you have your environment setup and you complete the steps in the 'Run a local development blockchain section', you can use the below walkthrough as a basic stepped approach to test thebountyzone dApp.

- First load the dApp @ http://localhost:3000.
- Using the default Meta Mask Account 1, click "Post New Bounty" to create a new bounty posting. Only you (current account) can accept or reject submissions to this bounty.
open App.js and add your first account address as the contract address on line 27 (contractAddr)
- Using Account 2, navigate to the dApp homepage http://localhost:3000 and click one of the new bounties posted. 
- Create a few new submissions for the bounty. Notice the UI updates by using events to sync the blockchain state to the UI state. Because this account did not create the bounty, you can only view the submissions after they are submitted.
- Now using Account 1, review one of the posted submissions, either accepting or rejecting it. If you reject a submission, bounty hunters can still submit solutions. If you accept the submission as the bounty poster, the submission is accepted and you will be prompted to send the bounty reward transaction. Once accepted, the bounty state is set to closed and the new submission form is disabled.


#### Additional Information

A document called design_pattern_desicions.md located in the project directory explains why the design patterns were used in this project.

A document called avoiding_common_attacks.md located in the project directory explains what measures are taken to ensure contracts are not susceptible to common attacks.


