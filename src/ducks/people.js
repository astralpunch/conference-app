import { appName } from '../config';
import { Record, OrderedMap } from 'immutable';
import { createSelector } from 'reselect';
import { SubmissionError, reset } from 'redux-form';
import firebase from 'firebase';
import { fbDatatoEntities } from './utils';
import { put, call, takeEvery, all, select, spawn, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

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

export const ADD_EVENT_TO_PERSON_REQUEST = `${prefix}/ADD_EVENT_TO_PERSON_REQUEST`;
export const ADD_EVENT_TO_PERSON_SUCCESS = `${prefix}/ADD_EVENT_TO_PERSON_SUCCESS`;

export const REMOVE_EVENT_FROM_PERSON_REQUEST = `${prefix}/REMOVE_EVENT_FROM_PERSON_REQUEST`;
export const REMOVE_EVENT_FROM_PERSON_SUCCESS = `${prefix}/REMOVE_EVENT_FROM_PERSON_SUCCESS`;

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

    case ADD_EVENT_TO_PERSON_SUCCESS:
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
  type: ADD_EVENT_TO_PERSON_REQUEST,
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
    const peopleRef = firebase.database().ref('people');
    const ref = yield call([peopleRef, peopleRef.push], values);

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

export const addEventToPersonSaga = function*(action) {
  const { eventUid, personUid } = action.payload;

  const eventsRef = firebase.database().ref(`people/${personUid}/events`);

  const state = yield select(stateSelector);
  const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);

  try {
    yield call([eventsRef, eventsRef.set], events);

    yield put({
      type: ADD_EVENT_TO_PERSON_SUCCESS,
      payload: {
        personUid,
        events,
      },
    });
  } catch (_) {}
};

export const removeEventFromPersonSaga = function*(action) {
  const { uid } = action.payload;

  const peopleRef = firebase.database().ref(`people`);

  const state = yield select(stateSelector);
  const people = state.get('entities');

  const updatedPeopleEvents = people.reduce((acc, person) => {
    if (person.events.includes(uid)) {
      return {
        ...acc,
        [`${person.uid}/events`]: person.events.filter(event => event !== uid),
      };
    }

    return acc;
  }, {});

  try {
    yield call([peopleRef, peopleRef.update], updatedPeopleEvents);

    yield put({
      type: REMOVE_EVENT_FROM_PERSON_SUCCESS,
      payload: {
        updatedPeopleEvents,
      },
    });

    yield put(fetchAllPeople());
  } catch (_) {}
};

const createPeopleSocket = () =>
  eventChannel(emmit => {
    const ref = firebase.database().ref('people');
    const callback = data => emmit({ data });

    ref.on('value', callback);

    return () => {
      ref.off('value', callback);
    };
  });

export const realtimeSync = function*() {
  const chan = yield call(createPeopleSocket);

  try {
    while (true) {
      const { data } = yield take(chan);

      yield put({
        type: FETCH_ALL_SUCCESS,
        payload: data.val(),
      });
    }
  } finally {
    yield call([chan, chan.close]);
  }
};

export const saga = function*() {
  yield spawn(realtimeSync);

  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(ADD_EVENT_TO_PERSON_REQUEST, addEventToPersonSaga),
    takeEvery(REMOVE_EVENT_FROM_PERSON_REQUEST, removeEventFromPersonSaga),
  ]);
};
