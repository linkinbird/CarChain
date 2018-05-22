import React, { Component } from 'react';
import { Grid, TextField, Button } from 'material-ui'; 

class InsuranceProviderUpdate extends Component {

	constructor() {
		super();
		this.state = {
			insuranceDetails: {}
		};
		this.updateInsuranceDetails = this.updateInsuranceDetails.bind(this);
		this.addNewInsurance = this.addNewInsurance.bind(this);
	}

	addNewInsurance(event) {
		var dataToInsert = this.state.insuranceDetails;
		console.log(dataToInsert);
		event.preventDefault();
		fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/InsuranceProviderUpdate`, {
			method: 'POST',
			body: JSON.stringify(dataToInsert),
			headers: new Headers({
			'Content-Type': 'application/json'
			})
		}).then(res => res.json())
		.catch(error => console.error('Error:', error))
		.then(response => {
			if(response.transactionId===undefined) {
				alert('there is some problem updating the insurance');
			} else {
	 			alert('New Insurance Data Updated Successfully \n Transaction Id:- ' + response.transactionId);
			}
		});
	}

	updateInsuranceDetails(event) {
		var id = event.target.id;
		var insuranceDetails = this.state.insuranceDetails;
		insuranceDetails[id] = event.target.value;
		this.setState({
			insuranceDetails: insuranceDetails
		});
	}

	ownershipForm() {
		return (
			<div>
			<form onSubmit={this.addNewInsurance}>
			<Grid container>
				<Grid item xs={12} sm={12}>
					<h3>New Insurance Details</h3>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField 
					  id="vin"
					  label="Vehicle Id"
					  onChange={this.updateInsuranceDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<br />
					<label>Current Insurance Issue Date Time</label>
					<TextField 
					  id="CurrentInsuranceIssue"
					  // label="Current Insurance Issue Date Time"
					  type="datetime-local"
					  onChange={this.updateInsuranceDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<br />
					<label>Current Insurance Expiry Date Time</label>
					<TextField 
					  id="CurrentInsuranceExpiry"
					  // label="Current Insurance Expiry Date TIme"
					  type="datetime-local"
					  onChange={this.updateInsuranceDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField 
					  id="CurrentInsuranceNumber"
					  label="Current Insurance Number"
					  onChange={this.updateInsuranceDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<br /><br />
					<Button variant="raised" color="primary" type="submit">
						Update Insurance
					</Button>
				</Grid>
			</Grid>
			</form>
			</div>
		);
	}

	render() {
		return(
			<div>
				<h2>Update Insurance Details</h2>
				{this.ownershipForm()}
			</div>
		);
	}
}

export default InsuranceProviderUpdate;