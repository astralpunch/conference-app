import { appName } from '../config';
import { Record, OrderedMap } from 'immutable';
import { createSelector } from 'reselect';
import { SubmissionError, reset } from 'redux-form';
import firebase from 'firebase';
import { fbDatatoEntities } from './utils';
import { put, call, take, all, takeEvery, select } from 'redux-saga/effects';

const ReducerRecord = Record({
  entities: new OrderedMap({}),
  loading: false,
  loaded: false,
});

const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null,
  events: [],
});

export const moduleName = 'people';
const prefix = `${appName}/${moduleName}`;

export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;

export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`;

// Reducer

export default (state = new ReducerRecord(), action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDatatoEntities(payload, PersonRecord));

    case ADD_PERSON_REQUEST:
      return state.set('loading', true);

    case ADD_PERSON_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['entities', payload.uid], new PersonRecord(payload));

    case ADD_EVENT_SUCCESS:
      return state.setIn(['entities', payload.personUid, 'events'], payload.events);

    default:
      return state;
  }
};

// Selectors

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities =>
  entities.valueSeq().toArray(),
);
export const idSelector = (_, props) => props.uid;
export const personSelector = createSelector(entitiesSelector, idSelector, (entities, id) =>
  entities.get(id),
);

// Action creators

export const fetchAllPeople = () => {
  return {
    type: FETCH_ALL_REQUEST,
  };
};

export const addPerson = person => {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person,
  };
};

export const addEventToPerson = (eventUid, personUid) => ({
  type: ADD_EVENT_REQUEST,
  payload: { eventUid, personUid },
});

// Sagas

export const fetchAllPeopleSaga = function*() {
  while (true) {
    yield take(FETCH_ALL_REQUEST);

    const ref = firebase.database().ref('people');

    const data = yield call([ref, ref.once], 'value');

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val(),
    });
  }
};

export const addPersonSaga = function*(action) {
  const {
    payload: { values, resolve, reject },
  } = action;

  try {
    const peopleIdRef = firebase.database().ref('people');

    const ref = yield call([peopleIdRef, peopleIdRef.push], values);

    yield put({
      type: ADD_PERSON_SUCCESS,
      payload: { uid: ref.key, ...values },
    });

    yield put(reset());

    yield call(resolve);
  } catch (err) {
    yield call(reject, new SubmissionError({ _error: 'error' }));
  }
};

export const addEventSaga = function*(action) {
  const { eventUid, personUid } = action.payload;
  console.log(1);
  const eventsRef = firebase.database().ref(`people/${personUid}/events`);
  console.log(2);
  const state = yield select(stateSelector);
  console.log(3);
  const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);
  console.log(4);

  try {
    yield call([eventsRef, eventsRef.set], events);
    yield put({
      type: ADD_EVENT_SUCCESS,
      payload: {
        personUid,
        events,
      },
    });
  } catch (_) {}
};

export const saga = function*() {
  yield all([
    fetchAllPeopleSaga(),
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(ADD_EVENT_REQUEST, addEventSaga),
  ]);
};
