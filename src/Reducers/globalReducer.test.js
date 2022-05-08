import {globalReducer, initialState} from './globalReducer';
import {
  RESIZE,
  CHANGE_TO_INDEX,
  UPDATE_DEC_INDEX,
  TOGGLE_SLIDE,
} from '../Actions/globalActions';

let expectedState = {};
// const USER = {email: 'asdf@gmail.com', password: 'willy'};

describe('globalReducer Test Suite', () => {
  beforeEach(() => {
    expectedState = {...initialState};
  });
  it('Initial State is returned with no action and state', () => {
    expect(globalReducer(undefined, {})).toEqual(expectedState);
  });
  it('Initial State is returned with no action', () => {
    expect(globalReducer(initialState, {})).toEqual(expectedState);
  });
  it('RESIZE works', () => {
    if (expectedState.height > expectedState.width) {
      expectedState.orientation = 'portrait';
    } else {
      expectedState.orientation = 'landscape';
    }
    expect(globalReducer(undefined, {type: RESIZE}))
        .toEqual(expectedState);
  });
  it('CHANGE_TO_INDEX works', () => {
    expectedState.index = 0;
    expectedState.decIndex = 0;
    expect(globalReducer(undefined, {type: CHANGE_TO_INDEX, index: 0}))
        .toEqual(expectedState);
  });
  it('UPDATE_DEC_INDEX works', () => {
    expectedState.decIndex = 0.123;
    expect(globalReducer(undefined, {type: UPDATE_DEC_INDEX, decIndex: 0.123}))
        .toEqual(expectedState);
  });
  it('TOGGLE_SLIDE works with input', () => {
    expectedState.slideDisabled = true;
    expect(globalReducer(initialState, {
      type: TOGGLE_SLIDE,
      state: true,
    })).toEqual(expectedState);
  });
  it('TOGGLE_SLIDE works with no input', () => {
    expectedState.slideDisabled = true;
    expect(globalReducer(initialState, {
      type: TOGGLE_SLIDE,
    })).toEqual(expectedState);
  });
});
