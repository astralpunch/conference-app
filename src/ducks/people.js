import firebase from 'firebase';
import { appName } from '../config';
import { Record, List } from 'immutable';
import { put, call, takeEvery } from 'redux-saga/effects';
import { generateId } from './utils';

const ReducerRecord = Record({
  people: new List(),
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null,
});

export const moduleName = 'people';

const prefix = `${appName}/${moduleName}`;
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
export const ADD_PERSON = `${prefix}/ADD_PERSON`;

export default (state = new ReducerRecord(), action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ADD_PERSON: {
      return state.update('people', people => people.push(new PersonRecord(payload)));
    }

    default:
      return state;
  }
};

export const addPerson = person => {
  return {
    type: ADD_PERSON_REQUEST,
    payload: person,
  };
};

export const addPersonSaga = function*(action) {
  const id = yield call(generateId);
  yield put({
    type: ADD_PERSON,
    payload: { ...action.payload, id },
  });
};

export const saga = function*() {
  yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga);
};
