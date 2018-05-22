import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function CarTable(props) {

  const { classes, data } = props;

  var cars = [];
  for(var i=0;i<data.length;i++) {
    var car = data[i].vehicleDetails;
    car.vin = data[i].vin;
    cars.push(car);
  }

  return (
    <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Identification Number</TableCell>
              <TableCell>Chasis Number</TableCell>
              <TableCell>Engine Number</TableCell>
              <TableCell>Maker Name</TableCell>
              <TableCell>Manufacturing Year</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Seating Capacity</TableCell>
              <TableCell>Type of Body</TableCell>
              <TableCell>Unique Vehicle Id</TableCell>
              <TableCell>Vehicle Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{car.vin}</TableCell>
                  <TableCell>{car.ChasisNumber}</TableCell>
                  <TableCell>{car.EngineNumber}</TableCell>
                  <TableCell>{car.MakerName}</TableCell>
                  <TableCell>{car.ManufacturingYear}</TableCell>
                  <TableCell>{car.RegistrationNumber}</TableCell>
                  <TableCell>{car.SeatingCapacity}</TableCell>
                  <TableCell>{car.TypeofBody}</TableCell>
                  <TableCell>{car.UniqueVehicleId}</TableCell>
                  <TableCell>{car.VehicleClass}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    </Paper>
  );
}

CarTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CarTable);