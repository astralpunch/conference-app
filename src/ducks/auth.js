import firebase from 'firebase';
import { appName } from '../config';
import { Record, List } from 'immutable';
import { SubmissionError } from 'redux-form';

const ReducerRecord = Record({
  user: null,
  people: new List(),
  error: null,
  loading: false,
});

export const moduleName = 'auth';
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;

export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;

export const ADD_PERSON = `${appName}/${moduleName}/ADD_PERSON`;



const reducer = (state = new ReducerRecord(), action) => {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
      return state.set('loading', true);

    case SIGN_UP_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_UP_ERROR:
      return state.set('loading', false).set('error', error);

    case ADD_PERSON:
      return state.update('people', (people) => people.set(state.people.size, payload))

    default:
      return state;
  }
};

export const signUp = (email, password) => {
  return async dispatch => {
    dispatch({
      type: SIGN_UP_REQUEST,
    });

    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      dispatch({
        type: SIGN_UP_SUCCESS,
        payload: { user },
      });
    } catch (error) {
      dispatch({
        type: SIGN_UP_ERROR,
        payload: error,
      });
      throw error;
    }
  };
};

export const addPerson = person => {
  return {
    type: ADD_PERSON,
    payload: person,
  }
}
// firebase.auth().onAuthStateChanged(user => {
// const store = require('../redux').default;
// store.dispatch({
//   type: SIGN_IN_SUCCESS,
//   payload: { user },
// });
// });

export default reducer;
