import React from 'react';
// import Stringify from "react-stringify";
import { Link } from "react-router-dom";

const BountyList = (props) => {
	const bountyListItems = props.bountyList.map((bList) => {
		let index = (props.bountyList.findIndex(k => k === bList) + 1)
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
			<h1>Bounty Zone Board:</h1>
			<ul>
				{/* { bountyListItems !== null ? bountyListItems : <li>Loading...</li> } */}
				{bountyListItems}
			</ul>

		</div>
	);
};

export default BountyList;