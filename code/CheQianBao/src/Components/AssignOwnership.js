import React, { Component } from 'react';
import { Grid, TextField, Button } from 'material-ui'; 

class AssignOwnership extends Component {

	constructor() {
		super();
		this.state = {
			vehicleDetails: {},
			contactDetails: {}
		};
		this.updateVehicleDetails = this.updateVehicleDetails.bind(this);
		this.updateContactDetails = this.updateContactDetails.bind(this);
		this.insertOwnership = this.insertOwnership.bind(this);
	}

	insertOwnership(event) {
		var dataToInsert = {
			vin: this.state.vehicleDetails['id'],
			vehicleDetails: this.state.vehicleDetails,
			contactDetails: this.state.contactDetails
		};
		event.preventDefault();
		fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/assignOwnership`, {
			method: 'POST',
			body: JSON.stringify(dataToInsert),
			headers: new Headers({
			'Content-Type': 'application/json'
			})
		}).then(res => res.json())
		.catch(error => console.error('Error:', error))
		.then(response => {
			alert('Ownership Assigned Successfully \n Transaction Id:- ' + response.transactionId);
		});
	}

	updateVehicleDetails(event) {
		var id = event.target.id;
		var vehicleDetails = this.state.vehicleDetails;
		vehicleDetails[id] = event.target.value;
		this.setState({
			vehicleDetails: vehicleDetails
		});
	}

	updateContactDetails(event) {
		var id = event.target.id;
		var contactDetails = this.state.contactDetails;
		contactDetails[id] = event.target.value;
		this.setState({
			contactDetails: contactDetails
		});
	}

	ownershipForm() {
		return (
			<div>
			<form onSubmit={this.insertOwnership}>
			<Grid container>
				<Grid item xs={12} sm={12}>
					<h3>Vehicle Details</h3>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="id"
					  label="Vehicle Id"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="ChasisNumber"
					  label="Chasis Number"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="EngineNumber"
					  label="Engine Number"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="MakerName"
					  label="Maker Name"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="ManufacturingYear"
					  label="Manufacturing Year"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="RegistrationNumber"
					  label="Registration Number"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="SeatingCapacity"
					  label="Seating Capacity"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="TypeofBody"
					  label="Type Of Body"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="UniqueVehicleId"
					  label="Unique Vehicle Id"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="VehicleClass"
					  label="Vehicle Class"
					  onChange={this.updateVehicleDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<br />
					<h3>Contact Details</h3>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="id"
					  label="Customer Id"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="customer_name"
					  label="Name"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="Phone"
					  label="Phone"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="emailId"
					  label="Email Id"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="street"
					  label="Street"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="city"
					  label="City"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="state"
					  label="State"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField 
					  id="country"
					  label="Country"
					  onChange={this.updateContactDetails}
					  required />					
				</Grid>
				<Grid item xs={12} sm={12}>
					<br /><br />
					<Button variant="raised" color="primary" type="submit">
						Assign Ownership
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
				<h2>Assign Ownership</h2>
				{this.ownershipForm()}
			</div>
		);
	}
}

export default AssignOwnership;