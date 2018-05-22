import React, { Component } from 'react';
import { Grid, TextField, Button, List, ListItem, ListItemText } from 'material-ui';

class InsuranceDetailsById extends Component {

	constructor() {
		super();
		this.state = {
			carId: '',
			insurance: null,
			error: false
		};
		this.changeCarId = this.changeCarId.bind(this);
		this.fetchInsurance = this.fetchInsurance.bind(this);
	}

	changeCarId(event) {
		this.setState({
			carId: event.target.value
		});
	}

	fetchInsurance(event) {
		event.preventDefault();
    	this.setState({ insurance: null });	    		
	    fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/queries/getInsuranceDetailsAccToVin?vin=${encodeURIComponent(this.state.carId)}`)
	    .then(results => {
	      return results.json();
	    }).then(data => {
	    	this.setState({ carId: '' });	    		
	    	if(data.length===0) {
	    		this.setState({ error: true });
	    	} else {
			    var insurance = data[0];
	    		this.setState({ error: false });
		    	this.setState({ insurance: insurance });	    		
	    	}
	    });
	}

	carForm() {
		return(
			<form onSubmit={this.fetchInsurance}>
		      <Grid container spacing={8}>
		        <Grid item xs={6}>
					<TextField 
					  id="vehicleId"
					  label="Enter Vehicle Id"
					  onChange={this.changeCarId}
					  value={this.state.carId}
					  required
					/>
		        </Grid>
		        <Grid item xs={6}>
					<Button type="submit" variant="raised" color="primary">
						Search
					</Button>
				</Grid>
		      </Grid>
		    </form>
		);
	}

	insuranceDetails() {
		if(this.state.insurance!=null) {
			return(
				<List component="nav">
					<ListItem button>
	                  <ListItemText><b>Current Insurance Number:- </b>{this.state.insurance.CurrentInsuranceNumber}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Current Insurance Issue Date and Time:- </b>{this.state.insurance.CurrentInsuranceIssue}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Current Insurance Expiry Date and Time:- </b>{this.state.insurance.CurrentInsuranceExpiry}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Previous Insurance Number:- </b>{this.state.insurance.PreviousInsuranceNumber}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Previous Insurance Issue Date and Time:- </b>{this.state.insurance.PreviousInsuranceIssue}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Previous Insurance Expiry Date and Time:- </b>{this.state.insurance.PreviousInsuranceExpiry}</ListItemText>
					</ListItem>
				</List>
			);			
		}
		if(this.state.error) {
			return(<div><br /><br /><b>Unable to fetch data.</b></div>);
		}
	}

	render() {
		return(
			<div>
			<h2>Get insurance details by Car Id</h2>
			{this.carForm()}
			{this.insuranceDetails()}
			</div>
		);
	}
}

export default InsuranceDetailsById;