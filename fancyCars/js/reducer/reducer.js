import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';

// For simplicity's sake (DUCKS structure), this module combines the three following items together:
// { actionTypes, actions, reducer }


// Action Types
const UPDATE_SORT_FIELD = 'UPDATE_SORT_FIELD';
const UPDATE_SORT_ORDER = 'UPDATE_SORT_ORDER';


// Action Creators
export function updateSortField(field) {
  return { type: UPDATE_SORT_FIELD, field };
}

export function updateSortOrder(orderAsc) {
  return { type: UPDATE_SORT_ORDER, orderAsc };
}

// Async Actions
const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'
  
function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`
    return acc
  }, {})
}

export const CARS = createRequestTypes('CARS');
export const CARS_AVAIL = createRequestTypes('CARS_AVAIL');

export const cars = {
  request: () => ({ type: CARS[REQUEST] }),
  success: (response) => ({ type: CARS[REQUEST], response }),
  failure: (error) => ({ type: CARS[FAILURE], error }),
}
  
export const cars_avail = {
  request: id => ({ type: CARS_AVAIL[REQUEST] }),
  success: (id, response) => ({ type: CARS_AVAIL[REQUEST], id, response }),
  failure: (id, error) => ({ type: CARS_AVAIL[FAILURE], id, error }),
}


export const LOAD_CARS = 'LOAD_CARS';
export const LOAD_CARS_AVAIL = 'LOAD_CARS_AVAIL';

export const loadCars = () => ({ type: LOAD_CARS });
export const loadCarsAvail = id => ({ type: LOAD_CARS_AVAIL, id });


// Reducer
export default function reducer(state = {
    cars: { 
      isFetching: false, 
      data: [],
    },
  
    carsAvail: { 
      isFetching: false, 
      data: {},
    },
  
    sort: { 
      field: "", 
      orderAsc: true,
    },
  }, action = {}) {
  switch (action.type) {
    case UPDATE_SORT_FIELD:
      return update(state, {sort: { field: { $set: action.field }}});
    case UPDATE_SORT_ORDER:
      return update(state, {sort: { orderAsc: { $set: action.orderAsc }}});
    
    case CARS[REQUEST]:
      return update(state, {cars: { isFetching: { $set: true }}});
    case CARS_AVAIL[REQUEST]:
      return update(state, {carsAvail: { isFetching: { $set: true }}});

    case CARS[FAILURE]:
      return update(state, {cars: { isFetching: { $set: false }}});
    case CARS_AVAIL[FAILURE]:
      return update(state, {carsAvail: { isFetching: { $set: false }}});


    case CARS[SUCCESS]:
      return update(state, {cars: { 
        isFetching: { $set: false },
        data: { $set: action.response },
      }});
    case CARS_AVAIL[SUCCESS]:
      const { id, response } = action;
      return update(state, {carsAvail: { 
        isFetching: { $set: false },
        data: { $merge: {[id]: response.available } },
      }});

    default: return state;
  }
}
