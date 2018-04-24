import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import authReducer, { moduleName as authModule } from '../ducks/auth';
import peopleReducer, { moduleName as peopleModule, ADD_PERSON_SUCCESS } from '../ducks/people';
import eventsReducer, { moduleName as eventsModule } from '../ducks/events';

export default combineReducers({
  router,
  form: formReducer.plugin({
    people: (state, action) => {
      const { type } = action;
      switch (type) {
        case ADD_PERSON_SUCCESS: {
          return undefined;
        }
        default:
          return state;
      }
    },
  }),
  [authModule]: authReducer,
  [peopleModule]: peopleReducer,
  [eventsModule]: eventsReducer,
});
