import { all, take, call, put, takeEvery, select } from 'redux-saga/effects';
import { appName } from '../config';
import { Record, OrderedMap, OrderedSet } from 'immutable';
import firebase from 'firebase';
import { createSelector } from 'reselect';
import { fbDatatoEntities } from './utils';

import { REMOVE_EVENT_FROM_PERSON_REQUEST } from './people';

// Constants

export const moduleName = 'events';
const prefix = `${appName}/${moduleName}`;

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`;
export const FETCH_LAZY_REQUEST = `${prefix}/FETCH_LAZY_REQUEST`;
export const FETCH_LAZY_START = `${prefix}/FETCH_LAZY_START`;
export const FETCH_LAZY_SUCCESS = `${prefix}/FETCH_LAZY_SUCCESS`;
export const SELECT_EVENT = `${prefix}/SELECT_EVENT`;
export const REMOVE_EVENT_REQUEST = `${prefix}/REMOVE_EVENT_REQUEST`;
export const REMOVE_EVENT_SUCCESS = `${prefix}/REMOVE_EVENT_SUCCESS`;

// Reducer

export const ReducerRecord = Record({
  entities: new OrderedMap({}),
  selected: new OrderedSet([]),
  loading: false,
  loaded: false,
});

export const EventRecord = Record({
  uid: null,
  title: null,
  url: null,
  where: null,
  when: null,
  month: null,
  submissionDeadline: null,
});

export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);

    case FETCH_LAZY_START:
      return state.set('loading', true);

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', true)
        .set('entities', fbDatatoEntities(payload, EventRecord));

    case FETCH_LAZY_SUCCESS:
      return state
        .set('loading', false)
        .mergeIn(['entities'], fbDatatoEntities(payload, EventRecord))
        .set('loaded', Object.keys(payload).length < 10);

    case SELECT_EVENT:
      return state.selected.contains(payload.uid)
        ? state.update('selected', selected => selected.remove(payload.uid))
        : state.update('selected', selected => selected.add(payload.uid));

    case REMOVE_EVENT_SUCCESS:
      return state
        .deleteIn(['entities', payload.uid])
        .update('selected', selected => selected.remove(payload.uid));

    default:
      return state;
  }
}

// Selectors

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const eventListSelector = createSelector(entitiesSelector, entities =>
  entities.valueSeq().toArray(),
);
export const selectionSelector = createSelector(stateSelector, state => state.selected);
export const selectedEventsSelector = createSelector(
  selectionSelector,
  entitiesSelector,
  (selected, entities) => selected.map(uid => entities.get(uid)).toArray(),
);
export const idSelector = (state, props) => props.uid;
export const eventSelector = createSelector(entitiesSelector, idSelector, (entities, id) =>
  entities.get(id),
);

// Action Creators

export const fetchAll = () => {
  return {
    type: FETCH_ALL_REQUEST,
  };
};

export const selectEvent = uid => {
  return {
    type: SELECT_EVENT,
    payload: { uid },
  };
};

export const fetchLazy = () => {
  return {
    type: FETCH_LAZY_REQUEST,
  };
};

export const removeEvent = uid => {
  return {
    type: REMOVE_EVENT_REQUEST,
    payload: { uid },
  };
};

// Sagas

export const fetchAllSaga = function*() {
  while (true) {
    yield take(FETCH_ALL_REQUEST);

    const ref = firebase.database().ref('events');
    const data = yield call([ref, ref.once], 'value');

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val(),
    });
  }
};

export const fetchLazySaga = function*() {
  while (true) {
    yield take(FETCH_LAZY_REQUEST);

    const state = yield select(stateSelector);

    if (state.loading || state.loaded) continue;

    yield put({
      type: FETCH_LAZY_START,
    });

    const lastEvent = state.entities.last();

    const ref = firebase
      .database()
      .ref('events')
      .orderByKey()
      .limitToFirst(10)
      .startAt(lastEvent ? lastEvent.uid : '');

    const data = yield call([ref, ref.once], 'value');

    yield put({
      type: FETCH_LAZY_SUCCESS,
      payload: data.val(),
    });
  }
};

export const removeEventSaga = function*(action) {
  const { uid } = action.payload;

  const ref = firebase.database().ref(`events/${uid}`);

  try {
    yield call([ref, ref.remove]);

    yield put({
      type: REMOVE_EVENT_FROM_PERSON_REQUEST,
      payload: { uid },
    });

    yield put({
      type: REMOVE_EVENT_SUCCESS,
      payload: {
        uid,
      },
    });
  } catch (_) {}
};

export function* saga() {
  yield all([fetchAllSaga(), fetchLazySaga(), takeEvery(REMOVE_EVENT_REQUEST, removeEventSaga)]);
}
