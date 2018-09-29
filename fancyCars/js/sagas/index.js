import { put, call, takeEvery  } from 'redux-saga/effects';
import { cars, cars_avail, loadCars, LOAD_CARS, LOAD_CARS_AVAIL } from '../reducer/reducer';
import { getCSRFToken } from '../util';

// URLS
const URL_CARS = '/cars';
const URL_CARS_AVAIL = id => `/availability?id=${id}`

// This is not necessary with get resquests
// but if we ever need post requests in the future, this will be useful
const csrftoken = getCSRFToken()

const DEFAULT_OPTION = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken,
  },
}

// API calls
const fetchData = (url) => {
  fetch(url, DEFAULT_OPTION)
  .then(response => {
    if (!response.ok) {
      // assumption: server returns error attrib in response
      return { error: response.error || 'Invalid response from server!', response };
    }
    return { error: null, response: response.json() };
  })
}


export function* loadCarsApi() {
  yield put(cars.request)
  const { response, error } = yield call(Api.fetchData, URL_CARS)
  if(response)
    yield put( cars.success(response) )
  else
    yield put( cars.failure(error) )
}


export function* loadCarsAvailApi(id) {
  yield put(cars_avail.request)
  const URL = URL_CARS_AVAIL(id)
  const { response, error } = yield call(Api.fetchData, URL)
  if(response)
    yield put( cars_avail.success(id, response) )
  else
    yield put( cars_avail.failure(id, error) )
}
 

export default function* rootSaga() {
  yield takeEvery(LOAD_CARS, loadCarsApi);
  yield takeEvery(LOAD_CARS_AVAIL, loadCarsAvailApi);
}