import {
  TOGGLE_FACING_MODE,
  SET_CAMERA_PERMISSIONS,
  SET_SCREEN,
  CAPTURED_IMAGE,
  UPDATE_SEND_LIST,
  UPDATE_SNAP_TIME,
} from '../Actions/cameraActions';
export const initialState = {
  facingMode: 'user',
  cameraPermissions: null,
  screen: 'camera',
  capturedImage: null,
  sendList: [],
  snapTime: -1,
  cameraResolution: 5000,
  cameraVideoOutput: null,
  cameraAudioInput: null,
  showStats: false,
  cameraButton: 'bottom',
};


/**
 *
 *
 * @export
 * @param {*} [state=initialState]
 * @param {*} action
 * @return {*}
 */
export function cameraReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FACING_MODE:
      if (action.facingMode) {
        return {
          ...state,
          facingMode: action.facingMode,
        };
      } else if (state.facingMode === 'environment') {
        return {
          ...state,
          facingMode: 'user',
        };
      } else {
        return {
          ...state,
          facingMode: 'environment',
        };
      }
    case SET_CAMERA_PERMISSIONS:
      return {
        ...state,
        cameraPermissions: action.cameraPermissions,
      };
    case SET_SCREEN:
      return {
        ...state,
        screen: action.screen,
      };
    case CAPTURED_IMAGE:
      return {
        ...state,
        capturedImage: action.capturedImage,
      };
    case UPDATE_SEND_LIST:
      return {
        ...state,
        sendList: action.sendList,
      };
    case UPDATE_SNAP_TIME:
      if (action.snapTime) {
        return {
          ...state,
          snapTime: action.snapTime,
        };
      } else {
        return {
          ...state,
          snapTime: -1,
        };
      }
    default:
      return state;
  }
}
