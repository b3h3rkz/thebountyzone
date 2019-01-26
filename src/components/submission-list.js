import React from 'react';
import SubmissionListItem from './submission-list-item';

const SubmissionList = (props) => {
	console.log("1 SubmissionList Component Props: ", props)
	console.log("2 SubmissionList Component Props: ", props.bounty)
	console.log("3SubmissionList Component Props: ", props.bounty.title)
	console.log("3SubmissionList Component Props: ", props.bounty.submissions)

	// const submissionListItems

	const subList = props.bounty.submissions

	console.log(subList)

	if (props.bounty.submissionCount > 0 ) {
		const submissionListItems = props.bounty.submissions.products.map((sList) => {
			let index = (props.bounty.submissions.products.findIndex(k => k === sList) + 1)
			return ( 	
						<li key={index}>
							({index})
							&nbsp;
							{sList.body} 
						</li> 
					)
		});	
	}

	// const submissionListItems = props.sList.map((sList) => {
	// 	return <SubmissionListItem key={sList.bountyId} bItem={sList} />
	// });

	return (

		<ul className="list-group col-sm-4">
		</ul>
	);
};


			// {props.bounty.submissionCount	 ? {submissionListItems} : null }
export default SubmissionList;