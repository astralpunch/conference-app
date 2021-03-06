import firebase from 'firebase';
import { appName } from '../config';
import { Record } from 'immutable';
import { eventChannel } from 'redux-saga';
import { all, call, put, take, spawn, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { realtimePeopleSync } from './people';

export const ReducerRecord = Record({
  user: null,
  error: null,
  loading: false,
});

export const moduleName = 'auth';
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;

export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`;

export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`;

export default (state = new ReducerRecord(), action) => {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
      return state.set('loading', true);

    case SIGN_UP_SUCCESS:
      return state.set('loading', false);

    case SIGN_UP_ERROR:
      return state.set('loading', false).set('error', error);

    case SIGN_IN_REQUEST:
      return state.set('loading', true);

    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_IN_ERROR:
      return state.set('loading', false).set('error', error);

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();

    default:
      return state;
  }
};

export const signUp = (email, password) => {
  return {
    type: SIGN_UP_REQUEST,
    payload: { email, password },
  };
};

export const signIn = (email, password) => {
  return {
    type: SIGN_IN_REQUEST,
    payload: { email, password },
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT_REQUEST,
  };
};

export const signUpSaga = function*() {
  while (true) {
    const action = yield take(SIGN_UP_REQUEST);
    const auth = firebase.auth();

    try {
      const user = yield call(
        [auth, auth.createUserWithEmailAndPassword],
        action.payload.email,
        action.payload.password,
      );

      yield put({
        type: SIGN_UP_SUCCESS,
        payload: { user },
      });

      yield spawn(realtimePeopleSync);

      yield put(push('/people'));
    } catch (error) {
      yield put({
        type: SIGN_UP_ERROR,
        error,
      });
    }
  }
};

export const signInSaga = function*() {
  const auth = firebase.auth();
  const action = yield take(SIGN_IN_REQUEST);

  try {
    const user = yield call(
      [auth, auth.signInWithEmailAndPassword],
      action.payload.email,
      action.payload.password,
    );

    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user },
    });

    yield spawn(realtimePeopleSync);

    yield put(push('/people'));
  } catch (error) {
    yield put({
      type: SIGN_IN_ERROR,
      error,
    });
  }
};

const createAuthChannel = () =>
  eventChannel(emit => firebase.auth().onAuthStateChanged(user => emit({ user })));

export const watchStatusChange = function*() {
  const chan = yield call(createAuthChannel);

  while (true) {
    const { user } = yield take(chan);

    if (user) {
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: { user },
      });
    } else {
      yield put({
        type: SIGN_OUT_SUCCESS,
        payload: { user },
      });

      yield put(push('/auth/signin'));
    }
  }
};

export const signOutSaga = function*() {
  const auth = firebase.auth();

  try {
    yield call([auth, auth.signOut]);

    yield put({
      type: SIGN_OUT_SUCCESS,
    });

    yield put(push('/auth/signin'));
  } catch (_) {}
};

export const saga = function*() {
  yield all([
    signUpSaga(),
    signInSaga(),
    watchStatusChange(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga),
  ]);
};
