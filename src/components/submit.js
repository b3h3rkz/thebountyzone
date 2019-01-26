import  React, { Component } from 'react';
//import { Link } from 'react-router-dom';

class Submit extends Component {
	constructor(props){
		super(props);
		this.state = {
			submission_text: ''
		}
		this.handleSubmit=this.handleSubmit.bind(this)
		this.updateField=this.updateField.bind(this)
	}

	updateField(event) {
		this.setState({ [ event.target.name ]: event.target.value })
	 }

	handleSubmit(event) {
		event.preventDefault();
		this.props.myBountyInstance.createSubmission(
			this.props.bountyId, 
			this.state.submission_text
		)
		this.setState({ submission_text: '' })
	}

	render() {
		return (
			<div>
				
				<form onSubmit={this.handleSubmit}>
					<input 
						style={{height: '200px', width: '400px'}}
						type="textarea" 
						name="submission_text" 
						placeholder="Solution Text"
						value={this.state.submission_text}
						onChange={this.updateField}  />

						<br />			<br />
					<input type="submit" value="Submit Solution"/>
				</form>
			</div>
		);
	}
};

//
export default Submit;