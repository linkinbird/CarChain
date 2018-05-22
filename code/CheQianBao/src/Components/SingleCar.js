import React, {Component} from 'react';
import {Grid, TextField, Button, List, ListItem, ListItemText} from 'material-ui';

class SingleCar extends Component {

    constructor() {
        super();
        this.state = {
            carId: '',
            car: null,
            error: false
        };
        this.changeCarId = this.changeCarId.bind(this);
        this.fetchCar = this.fetchCar.bind(this);
    }

    changeCarId(event) {
        this.setState({
            carId: event.target.value
        });
    }

    fetchCar(event) {
        event.preventDefault();
        this.setState({car: null});
        fetch(`http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/queries/getVehicleDetailsAccToVin?vin=${encodeURIComponent(this.state.carId)}`)
            .then(results => {
                return results.json();
            }).then(data => {
            this.setState({carId: ''});
            if (data.length === 0) {
                this.setState({error: true});
            } else {
                var car = data[0].vehicleDetails;
                car.vin = data[0].vin;
                this.setState({error: false});
                this.setState({car: car});
            }
        });
    }

    carForm() {
        return (
            <form onSubmit={this.fetchCar}>
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

    carDetails() {
        if (this.state.car != null) {
            return (
                <List component="nav">
                    <ListItem button>
                        <ListItemText><b>Vehicle Identification Number :- </b>{this.state.car.vin}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Chasis Number:- </b>{this.state.car.ChasisNumber}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Engine Number:- </b>{this.state.car.EngineNumber}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Maker Name:- </b>{this.state.car.MakerName}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Manufacturing Year:- </b>{this.state.car.ManufacturingYear}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Registration Number:- </b>{this.state.car.RegistrationNumber}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Seating Capacity:- </b>{this.state.car.SeatingCapacity}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Type of Body:- </b>{this.state.car.TypeofBody}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Unique Vehicle Id:- </b>{this.state.car.UniqueVehicleId}</ListItemText>
                    </ListItem>
                    <ListItem button>
                        <ListItemText><b>Vehicle Class:- </b>{this.state.car.VehicleClass}</ListItemText>
                    </ListItem>
                </List>
            );
        }
        if (this.state.error) {
            return (<div><br/><br/><b>Unable to fetch data.</b></div>);
        }
    }

    render() {
        return (
            <div>
                <h2>Get details by Car Id</h2>
                {this.carForm()}
                {this.carDetails()}
            </div>
        );
    }
}

export default SingleCar;