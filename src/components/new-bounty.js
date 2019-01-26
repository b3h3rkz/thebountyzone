import  React, { Component } from 'react';
// import {Navigation} from 'react-router';
// import { History } from "react-router-dom";
// import { browserHistory } from 'react-router-dom'
// import Stringify from 'react-stringify'
// import _ from 'lodash';
// import { push } from 'react-router-redux'

import {
	// BrowserRouter as Router,
	// Route,
	// Link,
	Redirect,
	withRouter
  } from "react-router-dom";

  
class NewBounty extends Component {
	constructor(props){
		super(props);
		this.state = {
			bounty_title: '',
      		bounty_description: '',
			bounty_amount: '',
			submitStatus: false
		}
		this.handleSubmit=this.handleSubmit.bind(this)
		this.updateField=this.updateField.bind(this)
		// this.resetSubmitStatus=this.resetSubmitStatus.bind(this)
	}
	
	updateField(event) {
		this.setState({ [ event.target.name ]: event.target.value })
	}
	
	async handleSubmit(event) {
		event.preventDefault();
		const web3 = this.props.state.web3
		const accountAddr = this.props.state.web3.eth.accounts[0]
		const title = this.state.bounty_title 
		const description = this.state.bounty_description 
		const amount = this.state.bounty_amount
		
		
		console.log(this.props.state)
		// await 
		this.props.state.myBountyInstance.createBounty(
			title, 
			description, 
			amount, 
			{
				from: accountAddr,
				value:  web3.toWei(this.state.bounty_amount, "ether")
			}
			)
			
			this.setState({ submitStatus: true })
			// this.setState({ 
			// 	bounty_title: '', 
			// 	bounty_description: '', 
			// 	bounty_amount: '' 
			// })
		}

	// resetSubmitStatus() {
	// 	this.setState({ submitStatus: false })
	// }

	render() {
		
		if (this.state.submitStatus === true) {
			return <Redirect from={process.env.PUBLIC_URL + '/new_bounty'} to={process.env.PUBLIC_URL + '/'} />
		}
		
		return (
			<div>
				<h1>New Bounty:</h1>
				<form onSubmit={this.handleSubmit}>
					Bounty Title<br />
					<input 
						style={{width: '400px'}}
						type="text" 
						name="bounty_title" 
						value={this.state.bounty_title} 
						onChange={this.updateField}
						/>

						<br /><br />
					Bounty Description<br />
					<input 

						style={{height: '200px', width: '400px', overflow: 'hidden'}}
						type="textarea" 
						rowSpan={10}
						name="bounty_description" 
						value={this.state.bounty_description}
						onChange={this.updateField} />

						<br /><br />
					Reward Amount (Ether)<br />
					<input type="text" 
						name="bounty_amount" 
						value={this.state.bounty_amount} 
						onChange={this.updateField} 
						// type="number"
						// maxLength="5"
						/>

					<br /><br />
              		<input type="submit" value="Post Bounty"/>
				</form>
			</div>
		);
	}
};

export default NewBounty