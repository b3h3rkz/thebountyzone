import React, { Component } from "react";
import Bounty from "./components/bounty";
import MyBounties from "./components/my-bounties";
import MySubmissions from "./components/my-submissions";
import NotFound from "./components/not-found";
import BountyList from "./components/bounty-list";
import NewBounty from "./components/new-bounty";
import myBountyContractABI from "../build/contracts/MyBounty.json";
import getWeb3 from "./utils/getWeb3";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: [], 
      myBountyInstance: null,
      bountyCount: null,
      bountyList: [],
      events: null,
      contractAddr: '0xbad911aa0f8759f3a22fde32a8057273967d4984'
    };

    this.CreateBounty = this.CreateBounty.bind(this)
    this.CreateSubmission = this.CreateSubmission.bind(this)
    this.RejectSubmission = this.RejectSubmission.bind(this)
    this.AcceptSubmission = this.AcceptSubmission.bind(this)
    this.initAccountUpdater = this.initAccountUpdater.bind(this)
    this.instantiateContract = this.instantiateContract.bind(this)

  }

  async componentDidMount() {
    try {
      const results = await getWeb3;
      this.setState({ web3: results.web3 });
      this.instantiateContract();
      this.initAccountUpdater();
    } catch (err) {
      console.log("Error finding web3.", err);
    }
  }
  
  initAccountUpdater() {
    let accountInterval = setInterval(() => {
      if (this.state.web3.eth.accounts[0] !== this.state.account) {
        const newAccount = this.state.web3.eth.accounts[0]
        this.setState({ account: newAccount })
        }
      }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.accountInterval)
  }

    CreateBounty (err, value) {
      let updateBountyList = this.state.bountyList
      let existingHash = false

      for (let i = 0; i <= (updateBountyList.length-1); i++) {
        if (updateBountyList[i].txHash === value.transactionHash) {
          existingHash = true
        }
      }

      if (existingHash === false) {
        let verboseNewBounty = {
          bountyId: value.args.bountyId.toNumber(),
          bountyPoster: value.args.bountyPoster,
          amount: value.args.amount.toNumber(),
          title: value.args.title,
          submissions: [],
          submissionCount: value.args.submissionCount.toNumber(),
          description: value.args.description,
          state: value.args.state.toNumber(),
          txHash: value.transactionHash
        }
        updateBountyList.push(verboseNewBounty)
        this.setState({ bountyList: updateBountyList })
      }
    }

    CreateSubmission (err, value) {
      let existingHash = false
      const updateBountyList = this.state.bountyList.map((bItem, index) => {
        bItem.submissions.map((sItem) => {
          if (sItem.txHash === value.transactionHash) {
            existingHash = true
          }
        })

        if ((index+1) === value.args.bountyId.toNumber() && existingHash === false) { 
          const newSubmission = {
            bountyId: value.args.bountyId.toNumber(),
            submissionId: value.args.submissionId.toNumber(),
            hunter: value.args.hunter,
            body: value.args.body,
            status: 2, // Penging Review status
            txHash: value.transactionHash
          }
          const updateSubmissions = [...bItem.submissions, newSubmission]          
          let newBItem = bItem
          newBItem.submissionCount++
          newBItem.submissions = updateSubmissions
          
        } 
        return bItem          
      })
      this.setState({ bountyList: updateBountyList })
    }

    AcceptSubmission (err, value) {
      const updateBountyList = this.state.bountyList.map((bItem, index) => {
          if ((index+1) === value.args.bountyId.toNumber()) { 
            const updateSubmissions = bItem.submissions.map((sItem) => {
              if (sItem.submissionId === value.args.submissionId.toNumber()) { 
                const acceptedSubmission = {
                  bountyId: sItem.bountyId,
                  submissionId: sItem.submissionId,
                  hunter: sItem.hunter,
                  body: sItem.body,
                  status: 0 //accepted === 0
                }
                return acceptedSubmission
              }
              return sItem
            })
            bItem.submissions = updateSubmissions
            bItem.state = 1
            return bItem
          } 
      })
      this.setState({ bountyList: updateBountyList })
    }
    
    RejectSubmission (err, value) {
      //  console.log("RejectSubmission: ", JSON.stringify(value, null, 2))
      const updateBountyList = this.state.bountyList.map((bItem, index) => {
          if ((index+1) === value.args.bountyId.toNumber()) { 
            const updateSubmissions = bItem.submissions.map((sItem) => {
              if (sItem.submissionId === value.args.submissionId.toNumber()) { 
                const rejectedSubmission = {
                  bountyId: sItem.bountyId,
                  hunter: sItem.hunter,
                  submissionId: sItem.submissionId,
                  body: sItem.body,
                  status: 1
                }
                return rejectedSubmission
              }
              return sItem
            })
            bItem.submissions = updateSubmissions
            return bItem
          } 
          return bItem
      })
      this.setState({ bountyList: updateBountyList })
    }
    
  instantiateContract() {
    const contract = require("truffle-contract");
    const myBounty = contract(myBountyContractABI);
    myBounty.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      try {
        // const myBountyInstance = await myBounty.deployed(); // local code
        const myBountyInstance = await myBounty.at(this.state.contractAddr);
        myBountyInstance.CreateBounty(this.CreateBounty)
        myBountyInstance.CreateSubmission(this.CreateSubmission)
        myBountyInstance.RejectSubmission(this.RejectSubmission)
        myBountyInstance.AcceptSubmission(this.AcceptSubmission)

        this.setState({ contractAddr: myBountyInstance.address });
        this.setState({ myBountyInstance: myBountyInstance });
        this.setState({ account: accounts[0] });

        const defaultAccountWeb3 = this.state.web3
        defaultAccountWeb3.eth.defaultAccount = accounts[0]
        defaultAccountWeb3.personal.unlockAccount = defaultAccountWeb3.eth.defaultAccount
        this.setState({ web3: defaultAccountWeb3 })

        const count = await this.state.myBountyInstance.bountyCount()
        this.setState({ bountyCount: count.toNumber() })

        const bountyBoardData = []; 

          for (let i = 1; i <= this.state.bountyCount; i++) {
            let bounty = await this.state.myBountyInstance.fetchBounty(i)
            const bountySubCount = bounty[5].toNumber()
            let bountySubmissions = []
            let verboseSubmissions = {}

            if (bountySubCount > 0) {
              for (let s = 1; s <= bountySubCount; s++) {
                let submission = await this.state.myBountyInstance.fetchSubmission(i , s)
                verboseSubmissions = {
                  bountyId: submission[0].toNumber(),
                  submissionId: submission[1].toNumber(),
                  hunter: submission[2],
                  body: submission[3],
                  status: submission[4].toNumber()
                }
                bountySubmissions.push(verboseSubmissions)
              }
            }

            const verboseBounty = { 
                bountyPoster: bounty[0],
                title: bounty[1],
                description: bounty[2],
                amount: bounty[3].toNumber(),
                state: bounty[4].toNumber(),
                submissionCount: bounty[5].toNumber(),
                submissions: bountySubmissions
              }
            bountyBoardData.push(verboseBounty)
          }

        this.setState({ bountyList: bountyBoardData })

      } catch (err) {
        console.log("Error instantiating contract.", err);
      }
    });
  }


  render() {
    if (this.state.web3 === null ) return <div>Loading...</div> 
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <nav className="navbar pure-menu pure-menu-horizontal">
            <Link to={process.env.PUBLIC_URL + '/new_bounty'} className="pure-menu-heading pure-menu-link" >
                Post New Bounty
              </Link>
              <Link to={process.env.PUBLIC_URL + '/'} className="pure-menu-heading pure-menu-link">
                Home
              </Link>
              <Link   to={process.env.PUBLIC_URL + '/my_bounties'} className="pure-menu-heading pure-menu-link" >
                My Bounties
              </Link>
              <Link to={process.env.PUBLIC_URL + '/my_submissions'} className="pure-menu-heading pure-menu-link" >
                My Submissions
              </Link>
              <Link to={''} className="pure-menu-heading pure-menu-link" >
                Account: {this.state.account}
              </Link>  
            </nav>

            <main className="container">
              <br />
              <div className="header text-xs-right">
                <p>
				          Ensure you have MetaMask installed and test Ether on the Ropsten Test Net (test Ether can by obtained from the <a href="https://faucet.metamask.io/" target="MM_facet">MetaMask Faucet</a>). 
				          Transactions generally take up to 30 seconds to appear due to the Ropsten Testnet block time. 
                  To submit a solution you must be using an account other than the Poster account. Only Bounty Posters can accept or reject submissions.
                </p>
                <hr />
              </div>
              <div>
                <Switch>
                  <Route 
                    exact  
                    path={process.env.PUBLIC_URL + '/my_bounties'} 
                    render={() => <MyBounties 
                      bountyList={this.state.bountyList}
                      account={this.state.account} />} 
                  />

                  <Route 
                    exact 
                    path={process.env.PUBLIC_URL + '/my_submissions'} 
                    render={() => (<MySubmissions 
                      bountyList={this.state.bountyList} 
                      bountyCount={this.state.bountyCount} 
                      account={this.state.account} />)}
                  />

                  <Route 
                    // exact  
                    path={process.env.PUBLIC_URL + '/bounty/:id'}
                    render={({match}) => <Bounty 
                      state={this.state} 
                      myBountyInstance={this.state.myBountyInstance} 
                      match={match} 
                      account={this.state.account} />} 
                  />

                  <Route     
                    exact   
                    path={process.env.PUBLIC_URL + '/new_bounty'} 
                    render={() => <NewBounty 
                      state={this.state} 
                      />}
                  />
                  
                  <Route 
                    exact  
                    path={process.env.PUBLIC_URL + '/'}
                    render={() => <BountyList 
                      bountyList={this.state.bountyList} />} 
                  />
                  <Route path="*" component={NotFound} /> 
                </Switch>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
