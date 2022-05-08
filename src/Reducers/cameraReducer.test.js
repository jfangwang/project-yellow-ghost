import {cameraReducer, initialState} from './cameraReducer';
import {
  TOGGLE_FACING_MODE,
  SET_CAMERA_PERMISSIONS,
  SET_SCREEN,
  CAPTURED_IMAGE,
  UPDATE_SEND_LIST,
  UPDATE_SNAP_TIME,
} from '../Actions/cameraActions';

let expectedState = {};

describe('cameraReducer Test Suite', () => {
  beforeEach(() => {
    expectedState = {...initialState};
  });
  it('Initial State is returned with no action and state', () => {
    expect(cameraReducer(undefined, {})).toEqual(expectedState);
  });
  it('Initial State is returned with no action', () => {
    expect(cameraReducer(initialState, {})).toEqual(expectedState);
  });
  it('TOGGLE_FACING_MODE works', () => {
    if (expectedState.facingMode === 'user') {
      expectedState.facingMode = 'environment';
    } else {
      expectedState.facingMode = 'user';
    }
    expect(cameraReducer(initialState, {type: TOGGLE_FACING_MODE}))
        .toEqual(expectedState);
    expectedState.facingMode = 'user';
    expect(cameraReducer(
        initialState, {type: TOGGLE_FACING_MODE, facingMode: 'user'}))
        .toEqual(expectedState);
  });
  it('SET_CAMERA_PERMISSIONS works', () => {
    expectedState.cameraPermissions = true;
    expect(cameraReducer(
        initialState, {type: SET_CAMERA_PERMISSIONS, cameraPermissions: true}))
        .toEqual(expectedState);
    expectedState.cameraPermissions = false;
    expect(cameraReducer(
        initialState, {type: SET_CAMERA_PERMISSIONS, cameraPermissions: false}))
        .toEqual(expectedState);
  });
  it('SET_CAMERA_PERMISSIONS works', () => {
    expectedState.cameraPermissions = true;
    expect(cameraReducer(
        initialState, {type: SET_CAMERA_PERMISSIONS, cameraPermissions: true}))
        .toEqual(expectedState);
    expectedState.cameraPermissions = false;
    expect(cameraReducer(
        initialState, {type: SET_CAMERA_PERMISSIONS, cameraPermissions: false}))
        .toEqual(expectedState);
  });
  it('SET_SCREEN works', () => {
    expectedState.screen = 'test';
    expect(cameraReducer(
        initialState, {type: SET_SCREEN, screen: 'test'}))
        .toEqual(expectedState);
  });
  it('CAPTURED_IMAGE works', () => {
    expectedState.capturedImage = 'test';
    expect(cameraReducer(
        initialState, {type: CAPTURED_IMAGE, capturedImage: 'test'}))
        .toEqual(expectedState);
  });
  it('UPDATE_SEND_LIST works', () => {
    expectedState.sendList = ['test'];
    expect(cameraReducer(
        initialState, {type: UPDATE_SEND_LIST, sendList: ['test']}))
        .toEqual(expectedState);
  });
  it('UPDATE_SNAP_TIME works', () => {
    expectedState.snapTime = -1;
    expect(cameraReducer(
        initialState, {type: UPDATE_SNAP_TIME}))
        .toEqual(expectedState);
    expectedState.snapTime = 7;
    expect(cameraReducer(
        initialState, {type: UPDATE_SNAP_TIME, snapTime: 7}))
        .toEqual(expectedState);
  });
});
