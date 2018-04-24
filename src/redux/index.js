import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';
import { routerMiddleware } from 'react-router-redux';
import history from '../history';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';

import conferences from '../mocks/conferences';
import firebase from 'firebase';

export function saveEventsToFB() {
  const eventsRef = firebase.database().ref('/events');
  conferences.forEach(conference => eventsRef.push(conference));
}

window.runMigration = () => {
  firebase
    .database()
    .ref('/events')
    .once('value', data => {
      if (!data.val()) saveEventsToFB();
    });
};

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware));
const store = createStore(reducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;
