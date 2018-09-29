import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { updateSortField, updateSortOrder, loadCars, loadCarsAvail } from '../reducer/reducer';


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { loadCars } = this.props.actions;
    loadCars();
  }

  componentWillReceiveProps(nextProps) {
    const { loadCarsAvail } = nextProps;
    if (nextProps.cars.data.length !== this.props.cars.data.length) {
      nextProps.cars.data.forEach((car) => {
        if (!nextProps.carsAvail.hasOwnProperty(car.id)) {
          loadCarsAvail(car.id);
        }
      });
    }
  }

  render() {
    const { cars, carsAvail, sort } = this.props;
    const { updateSortField, updateSortOrder } = this.props.actions;

    const options = [
      { value: 'name', label: 'Name' },
      { value: 'availability', label: 'Availability' },
    ];

    const idx = options.findIndex(item => item.value === sort.field);
    const dropDownValue = idx >= 0 ? options[idx] : "";

    const ascArrow = sort.orderAsc ? "A to Z" : "Z to A";
    const carsDisplay = cars.data.length === 0 ? [] : cars.data.sort((a, b) => {
      const orderAsc = sort.orderAsc ? -1 : 1;
      if (a[sort.field] < b[sort.field]) return orderAsc;
      if (a[sort.field] > b[sort.field]) return -1 * orderAsc;
      return 0;
    }).slice(0, Math.min(10, cars.data.length))

    return (
      <div>
        <h2>Welcome to Fancy Cars</h2>
        <label>
          Sort By
        </label>
        <div style={{ width: 150 }}>
          <Select
            value={dropDownValue}
            onChange={e => updateSortField(e.value)}
            options={options}
          />
        </div>
        <div>
          <button onClick={() => updateSortOrder(!sort.orderAsc)}>
            {ascArrow}
          </button>
        </div>
        <br />
        {cars.isFetching? <h2>Loading...</h2> : 
          <div>
            <table>
              <thead>
                <tr>
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Avaibility</th>
                  <th>Purchase</th>
                </tr>
              </thead>
              <tbody>
                { carsDisplay.map((car) => {
                  return (
                    <tr>
                      <td><img src={car.img} alt="" /></td>
                      <td>{car.name}</td>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>{carsAvail.data[car.id]}</td>
                      <td>{carsAvail.data[car.id] === "In Dealership" && 
                        <div>
                          <button> 
                            Purchase Car
                          </button>
                        </div>
                        }
                      </td>
                    </tr>)
                }) }
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { 
    cars: state.cars,
    carsAvail: state.carsAvail,
    sort: state.sort,
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    updateSortField,
    updateSortOrder,
    loadCars,
    loadCarsAvail,
  }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);