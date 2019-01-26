import React, { Component } from 'react';
//import { selectBounty } from '../actions/index';
//import { bindActionCreators } from 'redux';

export default class BountyList extends Component {

	render() {
		console.log("state: ", this.state);
		console.log("props: ", this.props);
		//var bountyBoardList = this.state.bountyList
		return (
			<ul className="list-group col-sm-4">
				
			</ul>
		)
	}
}




//<div>{this.state.bountyList[0]}</div>
				//{this.state.bountyList.map(d => <li className="list-group-item" key={d.title}>{d.title}</li>)}

	// renderList() {

	// 	//let titles = this.state.bountyList.map((title, key) => {
	// 	//	return <li key={key}>{title}</li>
	// 	//}

	// 	//let titleList = state => <li key=this.{state.bountyList.bountyId}></li>
		
	// //	const listData = this.state.bountyList.map((d) => <li key={d.title}>{d.title}</li>);

	// //	console.log(this.state.testList);
	// 	// return this.state.testList.map((title) => {
	// 	// 	return (
	// 	//  		<li 
	// 	// 			key={this.state.testList.title} 
	// 	// 			//onClick={() => this.props.selectBounty(bountyTitle)}
	// 	// 			className="list-group-item">
	// 	// 				{this.state.testList.title}
	// 	// 		</li>
	// 	//  	);
	// 	//  });
	// }    