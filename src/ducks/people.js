import { appName } from '../config';
import { Record, List } from 'immutable';
import { SubmissionError } from 'redux-form';
import firebase from 'firebase';
import { put, call, take, takeEvery } from 'redux-saga/effects';
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
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`;

// Reducer

export default (state = new ReducerRecord(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON: {
      return state.update('people', people => people.push(new PersonRecord(payload)));
    }

    default:
      return state;
  }
};

// Action creators

export const addPerson = person => {
  console.log(person);

  return {
    type: ADD_PERSON_REQUEST,
    payload: person,
  };
};

// Sagas

// function* saga() {
//   while (true) {
//     const {
//       payload: { values, resolve, reject },
//     } = yield take(TYPE);
//     // use resolve() or reject() here
//   }
// }

export const addPersonSaga = function*(action) {
  const id = yield call(generateId);

  const {
    payload: { values, resolve, reject },
  } = action;

  try {
    const peopleIdRef = firebase.database().ref(`people/${id}`);

    yield call([peopleIdRef, peopleIdRef.set], { ...values, id });
    yield put({
      type: ADD_PERSON_SUCCESS,
    });
    yield call(resolve);
  } catch (err) {
    yield call(reject, new SubmissionError({ _error: 'error' }));
  }
};

export const saga = function*() {
  yield takeEvery(ADD_PERSON_REQUEST, addPersonSaga);
};
