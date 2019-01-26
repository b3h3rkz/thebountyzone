import  React, { Component } from 'react';
import Submit from '../components/submit';

class Bounty extends Component {
	constructor(props){
		super(props);
		this.state = {
			myBountyInstance: this.props.myBountyInstance,
			bountyState: this.props.state.bountyList[+this.props.match.params.id-1].state
		}
		this.componentDidMount = this.componentDidMount.bind(this)
	}

	componentDidMount() {
		//const myBountyInstance = this.props.myBountyInstance
		// this.setState({ bountyState: bounty.state })
	}

	handleAction(e) {	
		// console.log("this.props.state = ", this.props.state)
		// console.log("bountyId = ", e.target.name)
		// console.log("submissionId = ", e.target.id)
		const bountyId = e.target.name 
		const submissionId = e.target.id 

		if (e.target.value === 'Accept') {
			this.state.myBountyInstance.acceptSubmission(bountyId, submissionId)
			this.setState({ bountyState: 1 })
		} else if (e.target.value === 'Reject') {
			this.state.myBountyInstance.rejectSubmission(bountyId, submissionId)
		}
	}

	render() {
		const bountyId = +this.props.match.params.id
		const bounty = this.props.state.bountyList[bountyId-1];
		const account = this.props.account
		const bountyPoster = bounty.bountyPoster

		//console.log("bountyState: ", this.state.bountyState)

		const submissionListItems = bounty.submissions.map((sList) => {
			let index = (bounty.submissions.findIndex(k => k === sList) + 1)

			let status = ''
			if 			(sList.status === 2) 	{ status = "Awaiting Review" } 
			else if 	(sList.status === 1) 	{ status = "Rejected" } 
			else	 							{ status = "Accepted" }

			return ( 	
						<li key={index}>
							<b>({index}) Bounty Hunter:</b> {sList.hunter} 
							<br />
							<b>Submission Status:</b> {status}
							<br />
							<b>Proposed Solution:</b><br />{sList.body}
							<br />
							{ account === bountyPoster && sList.status === 2 && this.state.bountyState !== 1  ? 
								<div>
									<input 
										id={index} 
										name={bountyId} 	
										type="submit" 	
										value="Accept" 
										onClick={this.handleAction.bind(this)}
									/>
									<input 
										id={index} 
										name={bountyId}  
										type="submit" 	
										value="Reject" 
										onClick={this.handleAction.bind(this)} 
									/>
						    	</div>
						    : null }
							<br /><br />
						</li> 
					)
		})

    	return (
      		<div>
				<h1>Bounty Post:</h1>

				<b>Bounty Poster:</b><br />
				{bounty.bountyPoster}<br /><br />

				<b>Bounty Title:</b><br />
				{bounty.title}<br /><br />

				<b>Bounty Description:</b><br />
				{bounty.description}<br /><br />

				<b>Bounty Reward:</b><br />
				{bounty.amount} Ether<br /><br />
				
				<b>Bounty State:</b><br />
				{ bounty.state === 0 ? 'Open' : 'Closed' }
				<br /><br />
				
				<b>Number of submissions:</b><br />
				{bounty.submissionCount}<br />

				{ account !== bountyPoster && bounty.state === 0 ? 
					<div>
						<br /><hr />
						<h1>Submit Solution:</h1>
						<Submit myBountyInstance={this.props.state.myBountyInstance} bountyId={bountyId} />
						</div>
				: null }

				<br /><hr />
				<h1>Submission List:</h1>
				<ul>
					{submissionListItems}
				</ul>
			</div>
    	);
  	}
}

export default Bounty;