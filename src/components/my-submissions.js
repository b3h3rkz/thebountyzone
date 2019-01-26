import  React, { Component } from 'react';

class MySubmissions extends Component {
	render() {
		const account = this.props.account

		const filteredSubmissionList = this.props.bountyList.filter(bounty => bounty.submissionCount > 0 && bounty.submissions.some(sub => account === sub.hunter ))
		const submissionListItems = filteredSubmissionList.map((item, index) => {
			return item.submissions.map((sub, sIndex) => {

				let status = ''
				if (sub.status === 2) { status = "Awaiting Review" } 
				else if (sub.status === 1) { status = "Rejected" } 
				else { status = "Accepted" }


				return (
						<li key={sub.bountyId+sIndex}>
							<b>Bounty ID:</b> {sub.bountyId} 
							<br />
							<b>Submission ID:</b> {sub.submissionId} 
							<br />
							<b>Submission Status:</b> {status}
							<br />
							<b>Proposed Solution:</b><br />{sub.body}
							<br /><br />
						</li> 	
				)
			})
		})

    	return (
      		<div>
				<h1>My Submissions:</h1>
				<ul>
					{submissionListItems}
				</ul>
			</div>
    	);
  	}
}

export default MySubmissions;