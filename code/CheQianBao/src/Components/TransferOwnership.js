import React, {Component} from 'react';
import {Grid, TextField, Button} from 'material-ui';

class TransferOwnership extends Component {

    constructor() {
        super();
        this.state = {
            contactDetails: {}
        };
        this.updateContactDetails = this.updateContactDetails.bind(this);
        this.transferOwnership = this.transferOwnership.bind(this);
    }

    transferOwnership(event) {
        var dataToInsert = {
            vin: this.state.contactDetails['vid'],
            contactDetails: this.state.contactDetails
        };
        event.preventDefault();
        fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/transferOwnership`, {
            method: 'POST',
            body: JSON.stringify(dataToInsert),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                alert('Ownership Transferred Successfully \n Transaction Id:- ' + response.transactionId);
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
                <form onSubmit={this.transferOwnership}>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <h3>New Contact Details</h3>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="vid"
                                label="Vehicle Id"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="id"
                                label="Customer Id"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="customer_name"
                                label="Name"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="Phone"
                                label="Phone"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="emailId"
                                label="Email Id"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="street"
                                label="Street"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="city"
                                label="City"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="state"
                                label="State"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="country"
                                label="Country"
                                onChange={this.updateContactDetails}
                                required/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <br/><br/>
                            <Button variant="raised" color="primary" type="submit">
                                Transfer Ownership
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h2>Transfer Ownership</h2>
                {this.ownershipForm()}
            </div>
        );
    }
}

export default TransferOwnership;