import React, { Component } from 'react';
import { Grid, TextField, Button, List, ListItem, ListItemText } from 'material-ui';

class ContactDetailsById extends Component {

	constructor() {
		super();
		this.state = {
			carId: '',
			contact: null,
			error: false
		};
		this.changeCarId = this.changeCarId.bind(this);
		this.fetchContact = this.fetchContact.bind(this);
	}

	changeCarId(event) {
		this.setState({
			carId: event.target.value
		});
	}

	fetchContact(event) {
		event.preventDefault();
    	this.setState({ contact: null });	    		
	    fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/queries/getContactDetailsAccToVin?vin=${encodeURIComponent(this.state.carId)}`)
	    .then(results => {
	      return results.json();
	    }).then(data => {
	    	console.log(data);
	    	this.setState({ carId: '' });	    		
	    	if(data.length===0) {
	    		this.setState({ error: true });
	    	} else {
			    var contact = data[0].contactDetails;
	    		this.setState({ error: false });
		    	this.setState({ contact: contact });	    		
	    	}
	    });
	}

	carForm() {
		return(
			<form onSubmit={this.fetchContact}>
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

	contactDetails() {
		if(this.state.contact!=null) {
			return(
				<List component="nav">
					<ListItem button>
	                  <ListItemText><b>Customer Name :- </b>{this.state.contact.customer_name}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Phone:- </b>{this.state.contact.Phone}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Email Id:- </b>{this.state.contact.emailId}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Street:- </b>{this.state.contact.street}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>City:- </b>{this.state.contact.city}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>State:- </b>{this.state.contact.state}</ListItemText>
					</ListItem>
					<ListItem button>
	                  <ListItemText><b>Country:- </b>{this.state.contact.country}</ListItemText>
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
			<h2>Get contact details by Car Id</h2>
			{this.carForm()}
			{this.contactDetails()}
			</div>
		);
	}
}

export default ContactDetailsById;