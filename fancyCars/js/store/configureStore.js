import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import reducer from '../reducer/reducer';


export default function configureStore(initialState = {}) {
  // Create the store with middlewares
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(
    reducer,
    compose(...enhancers)
  );

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store;
}