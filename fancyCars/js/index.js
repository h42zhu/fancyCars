import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import rootSaga from './sagas';
import configureStore from './store/configureStore';
import App from './container/App';

const initialState = {
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
};

const store = configureStore(initialState);
store.runSaga(rootSaga);

const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    MOUNT_NODE
  );
};

render();