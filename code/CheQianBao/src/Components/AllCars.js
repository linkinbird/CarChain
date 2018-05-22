import React, { Component } from 'react';
import CarTable from './CarTable';

class AllCars extends Component {

  constructor(props) {
    super(props);
    this.state = { cars: null };
  }
	
  componentDidMount() {
    // fetch('http://ec2-54-85-254-219.compute-1.amazonaws.com:3000/api/queries/getAllVehicleInfo')
    // .then(results => {
    //   return results.json();
    // }).then(data => {
    //   this.setState({
    //     cars: data
    //   });
    // });
  }

  renderTable() {
    if(this.state.cars!=null) {
      return <CarTable data={this.state.cars} />;      
    }
  }

  render() {
    return(
      <div>
        <center><h2>车联网设备数据资产钱包</h2></center>
        {this.renderTable()}
      </div>
    );
  }
}

export default AllCars;