import React from 'react';
import { Link } from "react-router-dom";

const MyBounties = (props) => {
	const bountyList = props.bountyList
	const filteredBountyList = bountyList.filter(function(bItem){
	  	return bItem.bountyPoster === props.account; 
	});

	const bountyListItems = filteredBountyList.map((bList) => {
		let index = (filteredBountyList.findIndex(k => k === bList) + 1)
		return ( 	
					<li key={index}>
						({index})&nbsp;
						<Link to={process.env.PUBLIC_URL + `/bounty/${index}`} className="link" >
						{bList.title} 
					</Link>
					</li> 
				)
	});

	return (
		<div>
			<h1>My Bounties:</h1>
			<ul>
				{bountyListItems}
			</ul>

		</div>
	);
};

export default MyBounties;