export const RESIZE = 'global/resize';
export const CHANGE_TO_INDEX = 'global/changeToIndex';
export const UPDATE_DEC_INDEX = 'global/updateDecimalIndex';
export const TOGGLE_SLIDE = 'global/toggleSlide';
export const SET_ORIENTATION = 'global/orientation';
export const TOGGLE_NAV_FOOT = 'global/toggleNavFoot';

/**
 * Resizes the window
 * @return {object}
 */
export function resize() {
  return {
    type: RESIZE,
  };
}
/**
 * Changes the index of swipeable routes
 * @param {int} index
 * @return {object}
 */
export function changeToIndex(index) {
  return {
    type: CHANGE_TO_INDEX,
    index: index,
  };
}
/**
 * Changes the index of swipeable routes in decimal form
 * @param {int} decIndex
 * @return {object}
 */
export function updateDecimalIndex(decIndex) {
  return {
    type: UPDATE_DEC_INDEX,
    decIndex: decIndex,
  };
}
/**
 * Disables and/or enables touch events on swipeable routes
 * @param {int} state true or false
 * @return {object}
 */
export function toggleSlide(state) {
  return {
    type: TOGGLE_SLIDE,
    state: state,
  };
}
/**
 * @export
 * @param {*} orientation
 * @return {*}
 */
export function setOrientation(orientation) {
  return {
    type: SET_ORIENTATION,
    orientation: orientation,
  };
}

/**
 * @export
 * @param {*} state
 * @return {*}
 */
export function toggleNavFoot(state) {
  return {
    type: TOGGLE_NAV_FOOT,
    state: state,
  };
}
