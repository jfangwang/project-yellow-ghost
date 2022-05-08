import {combineReducers} from 'redux';
import {userReducer} from './userReducer';
import {globalReducer} from './globalReducer';
import {cameraReducer} from './cameraReducer';

export default combineReducers({
  user: userReducer,
  global: globalReducer,
  camera: cameraReducer,
});
