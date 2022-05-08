import {Guest, Everyone, FakeDB} from '../Assets/data/GuestInfo';
import {
  EDIT_USER,
  EDIT_FAKE_DB,
  EDIT_EVERYONE,
  LOGGED_IN,
  LOGGED_OUT,
} from '../Actions/userActions';
export const initialState = {
  user: Guest,
  everyone: Everyone,
  isUserLoggedIn: false,
  fakeDB: FakeDB,
};

/**
 * userReducer: Contains user's states any component may need from redux store.
 * @param {object} state Defaults to initialState obj
 * @param {object} action
 * @return {object}
 */
export function userReducer(state = initialState, action) {
  switch (action.type) {
    case EDIT_USER:
      return {
        ...state,
        user: action.user,
      };
    case EDIT_FAKE_DB:
      return {
        ...state,
        fakeDB: action.fakeDB,
      };
    case EDIT_EVERYONE:
      return {
        ...state,
        everyone: action.everyone,
      };
    case LOGGED_IN:
      return {
        ...state,
        isUserLoggedIn: true,
      };
    case LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}
