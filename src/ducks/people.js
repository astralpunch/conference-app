import firebase from 'firebase';
import { appName } from '../config';
import { Record, List } from 'immutable';

const ReducerRecord = Record({
  people: new List(),
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const moduleName = 'people';

export const ADD_PERSON = `${appName}/${moduleName}/ADD_PERSON`;


const reducer = (state = new ReducerRecord(), action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ADD_PERSON:
      return state.update('people', (people) => people.push(new PersonRecord(payload)))

    default:
      return state;
  }
};


export const addPerson = person => {
  return (dispatch) => dispatch({
    type: ADD_PERSON,
    payload: {
      id: Date.now(), ...person,
    }
  })
}

export default reducer;
