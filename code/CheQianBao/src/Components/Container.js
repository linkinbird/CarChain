import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import AllCars from './AllCars';
import SingleCar from './SingleCar';
import SetupCar from './SetupCar';
import SimpleExpansionPanel from './TestForm';



import AssignOwnership from './AssignOwnership';
import TransferOwnership from './TransferOwnership';
import InsuranceProvider from './InsuranceProvider';
import InsuranceProviderUpdate from './InsuranceProviderUpdate';
import ContactDetailsById from './ContactDetailsById';
import InsuranceDetailsById from './InsuranceDetailsById';




const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    paddingTop: theme.spacing.unit * 0.5,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function Container(props) {

  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Paper className={classes.paper}><AllCars /></Paper>
        </Grid>
        <Grid item xs={12} sm={16}>
          <Paper className={classes.paper}><SetupCar /></Paper>
        </Grid>
        {/*<Grid item xs={12} sm={6}>*/}
          {/*<Paper className={classes.paper}><SimpleExpansionPanel /></Paper>*/}
        {/*</Grid>*/}
        {/*/!*<Grid item xs={12} sm={4}>*!/*/}
          {/*<Paper className={classes.paper}><TransferOwnership /></Paper>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12} sm={4}>*/}
          {/*<Paper className={classes.paper}><InsuranceProvider /></Paper>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12} sm={4}>*/}
          {/*<Paper className={classes.paper}><InsuranceProviderUpdate /></Paper>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12} sm={6}>*/}
          {/*<Paper className={classes.paper}><ContactDetailsById /></Paper>*/}
        {/*</Grid>*/}
        {/*<Grid item xs={12} sm={6}>*/}
          {/*<Paper className={classes.paper}><InsuranceDetailsById /></Paper>*/}
        {/*</Grid>*/}
      </Grid>
    </div>
  );
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Container);